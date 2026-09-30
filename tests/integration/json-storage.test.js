const fs = require("fs");
const JsonStorage = require("../../src/storage/json-storage");

test("loads tickets from a JSON file", () => {
    const filePath = "data/test-tickets.json";

    fs.writeFileSync(
        filePath,
        JSON.stringify([
            {
                id: 1,
                title: "Fix login",
                description: "Login is broken",
                status: "open",
                priority: "high",
                tags: ["backend"]
            }
        ])
    );

    const storage = new JsonStorage(filePath);

    const tickets = storage.load();

    expect(tickets).toHaveLength(1);
    expect(tickets[0].title).toBe("Fix login");
});