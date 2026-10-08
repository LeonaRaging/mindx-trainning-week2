import JsonStorage from "./src/storage/json-storage";
import TicketService from "./src/services/ticket-service";
import createKBClient from "./src/services/create-kb-client";

import {
    createTicket,
    listTickets,
    showTicket,
    updateTicket
} from "./src/commands/ticket-commands";
import {
    addKnowledgeBase,
    listKnowledgeBase,
    retrieveKnowledgeBase,
    searchKnowledgeBase
} from "./src/commands/kb-commands";

const filePath = process.env.TICKETS_FILE || "data/tickets.json";

const storage = new JsonStorage(filePath);
const service = new TicketService(storage);

const args = process.argv.slice(2);

async function main(): Promise<void> {
    if (args[0] === "tickets") {
        switch (args[1]) {
            case "create":
                createTicket(service, args);
                return;

            case "list":
                listTickets(service, args);
                return;

            case "show":
                showTicket(service, args);
                return;

            case "update":
                updateTicket(service, args);
                return;

            default:
                throw new Error("Unknown ticket command");
        }
    }

    if (args[0] === "kb") {
        const kbClient = createKBClient();

        switch (args[1]) {
            case "search":
                await searchKnowledgeBase(kbClient, args.slice(2));
                return;

            case "list":
                await listKnowledgeBase(kbClient, args.slice(2));
                return;

            case "retrieve":
                await retrieveKnowledgeBase(kbClient, args.slice(2));
                return;

            case "add":
                await addKnowledgeBase(kbClient, args.slice(2));
                return;

            default:
                throw new Error("Unknown KB command");
        }
    }

    if (args[0] === undefined) {
        throw new Error("Command is required");
    }

    throw new Error("Unknown command");
}

main().catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
});