const { app, BrowserWindow } = require("electron");

const { app: express, server } = require("./server");

let mainWindow;

// "nodemon --exec electron ."

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      contextIsolation: false,
    },
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.webContents.openDevTools();
});

server.listen(express.get("Port"), express.get("Host"), () => {
  console.log("servidor rodando");
});

