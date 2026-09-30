const fs = require("fs");
const JsonStorage = require("../../src/storage/json-storage");
const TicketService = require("../../src/services/ticket-service");

test("creates and persists a ticket", () => {
    const filePath = "data/integration-tickets.json";

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    const storage = new JsonStorage(filePath);
    const service = new TicketService(storage);

    const ticket = service.createTicket(
        "Fix login",
        "Users cannot log in",
        "high",
        ["backend"]
    );

    const saved = storage.load();

    expect(saved).toContainEqual(ticket);
});