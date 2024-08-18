const fs = require("fs");

class FileManager {
  
  ler_arquivo (name) {

    console.log(fs.existsSync("./data/items.json"));


    // const content = fs.readFileSync("./data/items.json");

    // console.log(content + " aasdsad");
  }

}

module.exports = new FileManager();
