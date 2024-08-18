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

const readFile = () => {
  const content = fs.readFileSync("./src/data/itens.json", "utf-8");
  return JSON.parse(content);
}

router.get("/", (req, res) => {
  const content = readFile();
  res.send(content);
});

router.post("/", (req, res) => {
  res.send("Express app");
});

router.put("/", (req, res) => {
  res.send("Express app");
});

router.delete("/", (req, res) => {
  res.send("Express app");
});

app.use(router);

module.exports = { app, server };
