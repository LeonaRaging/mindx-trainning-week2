const JsonStorage = require("./src/storage/json-storage");
const TicketService = require("./src/services/ticket-service");

const filePath = process.env.TICKETS_FILE || "data/tickets.json"
const storage = new JsonStorage(filePath);
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

if (
    args[0] === "tickets" &&
    args[1] === "list"
) {
    const filters = {};

    for (let i = 2; i < args.length; i++) {
        if (args[i] === "--status") {
            filters.status = args[i + 1];
        }

        if (args[i] === "--priority") {
            filters.priority = args[i + 1];
        }

        if (args[i] === "--tag") {
            filters.tag = args[i + 1];
        }
    }

    const tickets = service.listTickets(filters);

    for (const ticket of tickets) {
        console.log(`${ticket.id}: ${ticket.title}`);
    }
}

if (
    args[0] == "tickets" &&
    args[1] == "show"
) {
    const id = Number(args[2]);

    const ticket = service.getTicket(id);

    console.log(`ID: ${ticket.id}`);
    console.log(`Title: ${ticket.title}`);
    console.log(`Description: ${ticket.description}`);
    console.log(`Status: ${ticket.status}`);
    console.log(`Priority: ${ticket.priority}`);
    console.log(`Tags: ${ticket.tags.join(", ")}`);
}