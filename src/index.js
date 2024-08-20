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
});

server.listen(express.get("Port"), express.get("Host"), () => {
  console.log("servidor rodando");
});

// transfor váriáveis em Json e o contrário
// arrumar sistema de geração de arquivos api
// esturar fetch: https://www.youtube.com/watch?v=qIGYM4S8x50
