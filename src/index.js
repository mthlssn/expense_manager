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

server.listen(express.get("Port"), express.get("Host"));


// transfor váriáveis em Json e o contrário
// acabar o crud do api: https://www.youtube.com/watch?v=M7uMuGIlA98
// arrumar sistema de geração de arquivos api
// esturar fetch: https://www.youtube.com/watch?v=qIGYM4S8x50