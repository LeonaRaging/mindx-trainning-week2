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
}

module.exports = TicketService;