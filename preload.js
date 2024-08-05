const { contextBridge, ipcRenderer } = require('electron');

// Expose safe APIs to the renderer process
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel, data) => {
      // Define allowed channels
      const validChannels = ['oauth2-login', 'test-ipc'];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    on: (channel, func) => {
      const validChannels = ['login-success', 'test-ipc-response'];
      if (validChannels.includes(channel)) {
        // Strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    removeAllListeners: (channel) => {
      ipcRenderer.removeAllListeners(channel);
    }
  },
});
