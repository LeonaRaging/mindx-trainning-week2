const fs = require("fs");

class JsonStorage {
    constructor(filePath) {
        this.filePath = filePath;
    }

    load() {
        if (!fs.existsSync(this.filePath)) {
            return [];
        }

        const data = fs.readFileSync(this.filePath, "utf-8");
        return JSON.parse(data);
    }

    save(tickets) {
        fs.writeFileSync(
            this.filePath,
            JSON.stringify(tickets, null, 2)
        );
    }
}

module.exports = JsonStorage;