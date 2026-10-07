import {
    Ticket,
    TicketPriority,
    TicketStatus,
    validateTicket
} from "../models/ticket";
import type { Storage } from "../storage/json-storage";

export interface TicketFilters {
    status?: TicketStatus;
    priority?: TicketPriority;
    tag?: string;
}

export default class TicketService {
    constructor(private readonly storage: Storage) {}

    createTicket(
        title: string,
        description: string,
        priority: TicketPriority,
        tags: string[]
    ): Ticket {
        const tickets = this.storage.load();

        const ticket: Ticket = {
            id: tickets.length + 1,
            title,
            description,
            status: "open",
            priority,
            tags
        };

        validateTicket(ticket);

        this.storage.save([...tickets, ticket]);

        return ticket;
    }

    listTickets(filters: TicketFilters = {}): Ticket[] {
        let tickets = this.storage.load();

        if (filters.status) {
            tickets = tickets.filter(ticket => ticket.status === filters.status);
        }

        if (filters.priority) {
            tickets = tickets.filter(ticket => ticket.priority === filters.priority);
        }

        if (filters.tag) {
            const tag = filters.tag;
            tickets = tickets.filter(ticket => ticket.tags.includes(tag));
        }

        return tickets;
    }

    getTicket(id: number): Ticket {
        const tickets = this.storage.load();

        const ticket = tickets.find(ticket => ticket.id === id)

        if (!ticket) {
            throw new Error("Ticket not found");
        }

        return ticket;
    }

    updateStatus(id: number, status: TicketStatus | undefined): Ticket {
        const tickets = this.storage.load();

        const ticket = tickets.find(ticket => ticket.id === id);

        if (!ticket) {
            throw new Error("Ticket not found");
        }

        if (
            status !== "open" &&
            status !== "in_progress" &&
            status !== "closed"
        ) {
            throw new Error("Invalid ticket status");
        }

        ticket.status = status;

        this.storage.save(tickets);

        return ticket;
    }
}