const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Menu actions from main process
  onMenuAction: (callback) => {
    ipcRenderer.on('menu-action', (event, action) => callback(action));
  },

  // Remove listener
  removeMenuActionListener: () => {
    ipcRenderer.removeAllListeners('menu-action');
  },

  // Platform info
  platform: process.platform,

  // App version
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
});
