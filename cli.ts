import JsonStorage from "./src/storage/json-storage";
import TicketService from "./src/services/ticket-service";

import {
    createTicket,
    listTickets,
    showTicket,
    updateTicket
} from "./src/commands/ticket-commands";

const filePath = process.env.TICKETS_FILE || "data/tickets.json";

const storage = new JsonStorage(filePath);
const service = new TicketService(storage);

const args = process.argv.slice(2);

if (args[0] !== "tickets") {
    throw new Error("Unknown command");
}

switch (args[1]) {
    case "create":
        createTicket(service, args);
        break;

    case "list":
        listTickets(service, args);
        break;

    case "show":
        showTicket(service, args);
        break;

    case "update":
        updateTicket(service, args);
        break;

    default:
        throw new Error("Unknown ticket command");
}