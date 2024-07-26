const { app, BrowserWindow } = require('electron');
const path = require('path');

// Add this at the top of the file, before the app is created
require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
  });
  
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false, // Disable Node.js integration
      contextIsolation: true, // Enable context isolation
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Hide the menu bar
  //mainWindow.setMenuBarVisibility(false);

  // Open the DevTools (optional)
  mainWindow.webContents.openDevTools();
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
