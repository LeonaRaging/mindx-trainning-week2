export {};

import JsonStorage from "../../src/storage/json-storage";
import TicketService from "../../src/services/ticket-service";

const fs = require("fs");
const filePath = "data/integration-tickets.json";

test("creates and persists a ticket", () => {

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

afterEach(() => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
    }
})