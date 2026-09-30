const { validateTicket } = require("../models/ticket")

class TicketService {
    constructor(storage) {
        this.storage = storage;
    }

    createTicket(title, description, priority, tags) {
        const tickets = this.storage.load();

        const ticket = {
            id: tickets.length + 1,
            title,
            description,
            status: "open",
            priority,
            tags
        }

        validateTicket(ticket);

        this.storage.save([ticket]);

        return ticket;
    }

    listTickets(filters = {}) {
        const tickets = this.storage.load();

        if (filters.status) {
            return tickets.filter(ticket => ticket.status === filters.status);
        }

        if (filters.priority) {
            return tickets.filter(ticket => ticket.priority === filters.priority);
        }

        if (filters.tag) {
            return tickets.filter(ticket => ticket.tags.includes(filters.tag));
        }

        return tickets;
    }

    getTicket(id) {
        const tickets = this.storage.load();

        const ticket = tickets.find(ticket => ticket.id === id)

        if (!ticket) {
            throw new Error("Ticket not found");
        }

        return ticket;
    }
}

module.exports = TicketService;