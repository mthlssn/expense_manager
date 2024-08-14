const {app, BrowserWindow} = require('electron');

let mainWindow;

// "nodemon --exec electron ."

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            contextIsolation: false
        }
    });

    mainWindow.loadURL(`file://${__dirname}/index.html`);
});