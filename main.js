const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { openOAuth2Window } = require('./client/auth/oauth2'); 
const { makeApiRequest } = require('./client/utils/api');
require('dotenv').config();

// Declare mainWindow at the module level
let mainWindow;
let Store;

async function initializeStore() {
  const Store = (await import('electron-store')).default;
  store = new Store();
}



async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Ensure preload script path is correct
      contextIsolation: true,  // Enable context isolation for security
      nodeIntegration: false,  // Disable Node.js integration for security
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:9000'); // Ensure correct dev URL
    mainWindow.webContents.openDevTools();
  } else if (process.env.NODE_ENV === 'production') {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'))
      .catch(err => console.error('Failed to load index.html:', err)); // Log errors if any
  }

  mainWindow.on('closed', () => {
    mainWindow = null; // Ensure cleanup
  });
}

app.whenReady().then(async () => {
  await initializeStore(); // Initialize the store before creating the window
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle OAuth2 login requests from the renderer process
ipcMain.on('oauth2-login', async (event) => {
  try {
    const tokens = await openOAuth2Window();
    saveToken(tokens);
    //console.log('User logged in:', tokens);
    
    await makeApiRequest(tokens.access_token);

    if (mainWindow) {
      mainWindow.webContents.send('login-success', tokens);
      console.log('Sent login-success to renderer');
    } else {
      console.error('mainWindow is not available');
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
});




function saveToken(token) {
  store.set('authToken', token.access_token);
  store.set('refreshToken', token.refresh_token);
  store.set('tokenExpiry', Date.now() + token.expires_in * 1000); // store expiry time
}

function getToken() {
  return {
    accessToken: store.get('authToken'),
    refreshToken: store.get('refreshToken'),
    tokenExpiry: store.get('tokenExpiry'),
  };
}

function isTokenExpired() {
  const { tokenExpiry } = getToken();
  return Date.now() > tokenExpiry;
}

async function refreshAccessToken() {
  const { refreshToken } = getToken();

  // Make a request to refresh the token
  const response = await fetch('https://google.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (response.ok) {
    const newToken = await response.json();
    saveToken(newToken);
    return newToken.access_token;
  } else {
    // Handle the error, possibly by redirecting to the login screen
    console.error('Failed to refresh token');
    return null;
  }
};

async function getValidToken() {
  if (isTokenExpired()) {
    if (navigator.onLine) {
      return await refreshAccessToken();
    } else {
      console.error('Token expired and no internet connection');
      return null;
    }
  }
  return getToken().accessToken;
}

// main.js or index.js (Electron Main Process)
ipcMain.handle('save-token', (event, token) => {
  saveToken(token);
});

ipcMain.handle('get-token', () => {
  return getToken();
});

ipcMain.handle('get-valid-token', async () => {
  return await getValidToken();
});