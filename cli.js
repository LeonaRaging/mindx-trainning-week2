const JsonStorage = require("./src/storage/json-storage");
const TicketService = require("./src/services/ticket-service");

const storage = new JsonStorage("data/tickets.json");
const service = new TicketService(storage);

const args = process.argv.slice(2);

if (
    args[0] === "tickets" &&
    args[1] === "create"
) {
    const title = args[2];
    const description = args[3];
    const priority = args[4];
    const tags = args.slice(5);

    service.createTicket(
        title,
        description,
        priority,
        tags
    );

    console.log("Ticket created");
}