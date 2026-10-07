import type TicketService from "../services/ticket-service";
import type { TicketFilters } from "../services/ticket-service";
import type { TicketPriority, TicketStatus } from "../models/ticket";

export function createTicket(service: TicketService, args: string[]): void {
    const title = args[2];
    const description = args[3];
    const priority = args[4];
    const tags = args.slice(5);

    service.createTicket(
        title,
        description,
        priority as TicketPriority,
        tags
    );

    console.log("Ticket created");
}

export function listTickets(service: TicketService, args: string[]): void {
    const filters: TicketFilters = {};

    for (let i = 2; i < args.length; i++) {
        if (args[i] === "--status") {
            const status = args[i + 1];
            if (status) {
                filters.status = status as TicketStatus;
            }
        }

        if (args[i] === "--priority") {
            const priority = args[i + 1];
            if (priority) {
                filters.priority = priority as TicketPriority;
            }
        }

        if (args[i] === "--tag") {
            const tag = args[i + 1];
            if (tag) {
                filters.tag = tag;
            }
        }
    }

    const tickets = service.listTickets(filters);

    for (const ticket of tickets) {
        console.log(`${ticket.id}: ${ticket.title}`);
    }
}

export function showTicket(service: TicketService, args: string[]): void {
    const id = Number(args[2]);
    const ticket = service.getTicket(id);

    console.log(`ID: ${ticket.id}`);
    console.log(`Title: ${ticket.title}`);
    console.log(`Description: ${ticket.description}`);
    console.log(`Status: ${ticket.status}`);
    console.log(`Priority: ${ticket.priority}`);
    console.log(`Tags: ${ticket.tags.join(", ")}`);
}

export function updateTicket(service: TicketService, args: string[]): void {
    const id = Number(args[2]);

    let status: TicketStatus | undefined;

    if (args[3] === "--status") {
        status = args[4] as TicketStatus;
    }

    service.updateStatus(id, status);

    console.log("Ticket updated");
}
