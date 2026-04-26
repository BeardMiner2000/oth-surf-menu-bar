const path = require('path');
const { pathToFileURL } = require('url');
const { Menu, shell } = require('electron');
const menubar = require('menubar');

const API_URL = process.env.OTH_SURF_API_URL || 'https://oth-surf-scraper.onrender.com';
const indexUrl = new URL(pathToFileURL(path.join(__dirname, 'index.html')).toString());
indexUrl.searchParams.set('api', API_URL);
const trayIconPath = process.resourcesPath
  ? path.join(process.resourcesPath, 'trayTemplate.png')
  : path.join(__dirname, '..', 'resources', 'trayTemplate.png');

const mb = menubar({
  index: indexUrl.toString(),
  icon: trayIconPath,
  tooltip: 'OTH SURF',
  width: 420,
  height: 640,
  preloadWindow: true,
  showDockIcon: false,
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true
  }
});

mb.on('ready', () => {
  const menu = Menu.buildFromTemplate([
    { label: 'Show OTH SURF', click: () => mb.showWindow() },
    { label: 'Open oth.surf', click: () => shell.openExternal('https://oth.surf') },
    { type: 'separator' },
    { label: 'Quit', role: 'quit' }
  ]);

  mb.tray.setContextMenu(menu);
});

mb.on('after-create-window', () => {
  mb.window.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
});
