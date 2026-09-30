const fs = require("fs");

class JsonStorage {
    constructor(filePath) {
        this.filePath = filePath;
    }

    load() {
        const data = fs.readFileSync(this.filePath, "utf-8");
        return JSON.parse(data);
    }
}

module.exports = JsonStorage;