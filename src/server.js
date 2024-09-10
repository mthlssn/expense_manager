const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const router = express.Router();
const fs = require("fs");
const { log } = require("console");

const host = "0.0.0.0";
const port = 3456;

app.set("Host", host);
app.set("Port", port);

app.use(express.json({ extended: true }));

// lendo arquivo
const readFile = (data) => {
  var content = [];
  let path_app = __dirname + "/expense_manager/";

  if (!fs.existsSync(path_app)) {
    fs.mkdirSync(path_app, (err) => {
      if (err) {
        console.log(err);
      } else {
        fs.mkdirSync(path_app + "dados/", (err) => {
          if (err) {
            console.log(err);
          }
        });
        fs.mkdirSync(path_app + "configs/", (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
    });
  }

  path_app = path_app + "dados/";

  // all
  // y2025
  // m08-2024

  if (data[0] == "a") {
    pass;
  } else if (data[0] == "y") {
    pass;
  } else if (data[0] == "m") {
    let file = path_app + data.slice(1) + ".json";

    if (fs.existsSync(file)) {
      content = JSON.parse(fs.readFileSync(file, "utf-8"));
    } else {
      fs.writeFileSync(file, "[]", "utf-8");
    }
  }

  return content;
};

// escrevendo arquivo
const writeFile = (content, data) => {
  let file = __dirname + "/expense_manager/dados/" + data + ".json";

  content.sort(function compare(a, b) {
    let temp_a = a.data[8] + a.data[9];
    let temp_b = b.data[8] + b.data[9];

    if (temp_a < temp_b) return -1;
    if (temp_a > temp_b) return 1;
    return 0;
  });

  const updateFile = JSON.stringify(content);
  fs.writeFileSync(file, updateFile, "utf-8");
};

router.get("/:data", (req, res) => {
  const { data } = req.params;

  const content = readFile(data);
  res.send(content);
});

router.get("/:data/:id", (req, res) => {
  const { data, id } = req.params;
  const currentContent = readFile("m" + data);

  const selectedItem = currentContent.find((item) => item.id === id);

  if (selectedItem != -1) {
    res.send(selectedItem);
  }
});

router.post("/", async (req, res) => {
  const { consumo, desconsumo, titulo, valor, data, categoria, registar } =
    req.body;

  const currentContent = await readFile("m" + data.slice(0, -3));
  const id = Math.random().toString(32).substring(2, 9);

  currentContent.push({
    id,
    consumo,
    desconsumo,
    titulo,
    valor,
    data,
    categoria,
    registar,
  });

  writeFile(currentContent, data.slice(0, -3));

  res.send({
    id,
    consumo,
    desconsumo,
    titulo,
    valor,
    data,
    categoria,
    registar,
  });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { consumo, desconsumo, titulo, valor, data, categoria, registar } =
    req.body;

  const currentContent = readFile("m" + data.slice(0, -3));
  const selectedItem = currentContent.findIndex((item) => item.id === id);

  if (selectedItem != -1) {
    currentContent[selectedItem] = {
      id,
      consumo,
      desconsumo,
      titulo,
      valor,
      data,
      categoria,
      registar,
    };
    writeFile(currentContent, data.slice(0, -3));

    res.send({
      id,
      consumo,
      desconsumo,
      titulo,
      valor,
      data,
      categoria,
      registar,
    });
  }
});

router.delete("/:data/:id", (req, res) => {
  const { data, id } = req.params;
  const currentContent = readFile("m" + data);

  const selectedItem = currentContent.findIndex((item) => item.id === id);

  if (selectedItem != -1) {
    currentContent.splice(selectedItem, 1);
    writeFile(currentContent, data);
    res.send(true);
  } else {
    res.send(false);
  }
});

app.use(router);

module.exports = { app, server };

// server.listen(port, host, () => {
//   console.log("servidor rodando só no servidor");
// });
