const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '../public/icon.png'),
    title: 'Dungeon Mapper',
    backgroundColor: '#0f0f1a',
    show: false,
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Create menu
  const template = [
    {
      label: 'Arquivo',
      submenu: [
        {
          label: 'Novo Mapa',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('menu-action', 'new');
          }
        },
        {
          label: 'Abrir...',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            mainWindow.webContents.send('menu-action', 'open');
          }
        },
        {
          label: 'Salvar',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow.webContents.send('menu-action', 'save');
          }
        },
        { type: 'separator' },
        {
          label: 'Exportar como PNG',
          accelerator: 'CmdOrCtrl+E',
          click: () => {
            mainWindow.webContents.send('menu-action', 'export');
          }
        },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'Editar',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'Visualizar',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Ferramentas',
      submenu: [
        {
          label: 'Gerar Masmorra Aleatória',
          accelerator: 'CmdOrCtrl+Shift+G',
          click: () => {
            mainWindow.webContents.send('menu-action', 'generate');
          }
        },
        {
          label: 'Limpar Mapa',
          accelerator: 'CmdOrCtrl+Shift+L',
          click: () => {
            mainWindow.webContents.send('menu-action', 'clear');
          }
        }
      ]
    },
    {
      label: 'Ajuda',
      submenu: [
        {
          label: 'Sobre',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Sobre o Dungeon Mapper',
              message: 'Dungeon Mapper v1.0.0',
              detail: 'Crie masmorras e mapas de batalha para RPG de mesa.\n\nDesenvolvido com Electron, React e TypeScript.',
              buttons: ['OK']
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  mainWindow.on('closed', () => {
    mainWindow = null;
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
