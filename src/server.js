const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const router = express.Router();
const fs = require("fs");

const host = "0.0.0.0";
const port = 3456;

app.set("Host", host);
app.set("Port", port);

app.use(express.json({ extended: true }));

// lendo arquivo
const readFile = () => {
  const content = fs.readFileSync("./src/data/itens.json", "utf-8");
  return JSON.parse(content);
}

// escrevendo arquivo
const writeFile = (content) => {
  const updateFile = JSON.stringify(content);
  fs.writeFileSync("./src/data/itens.json", updateFile, "utf-8"); 
}

router.get("/", (req, res) => {
  const content = readFile();
  res.send(content);
});

router.post("/", (req, res) => {
  const {name, email, phone} = req.body;

  const currentContent = readFile();
  const id = Math.random().toString(32).substring(2, 9);

  currentContent.push({id, name, email, phone});
  writeFile(currentContent);

  res.send({id, name, email, phone});
});

router.put("/:id", (req, res) => {
  const {id} = req.params;
  const {name, email, phone} = req.body;
  
  const currentContent = readFile();
  const selectedItem = currentContent.findIndex((item) => item.id === id);

  const {id: cId, name: cName, email: cEmail, phone: cPhone } = currentContent[selectedItem];
  const newObject = {
    id: cId,
    name: name ? name: cName,
    email: email ? email: cEmail,
    phone: phone ? phone: cPhone,
  }


  currentContent[selectedItem] = newObject;
  writeFile(currentContent);

  res.send(newObject);
});

router.delete("/:id", (req, res) => {
  const {id} = req.params;
  const currentContent = readFile();

  const selectedItem = currentContent.findIndex((item) => item.id === id);
  currentContent.splice(selectedItem, 1);

  writeFile(currentContent);

  res.send(true);
});

app.use(router);

module.exports = { app, server };

server.listen(port, host, () => {
  console.log("servidor rodando só no servidor");
});