const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { openOAuth2Window } = require('./client/auth/oauth2'); 
const { storeTokens, makeApiRequest } = require('./client/utils/api');

// Declare mainWindow at the module level
let mainWindow;

function createWindow() {
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

app.whenReady().then(createWindow);

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
    storeTokens(tokens);
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
