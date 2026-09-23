const TicketService = require("../../src/services/ticket-service");

test("creates a ticket", () => {
    const storage = {
        load: jest.fn().mockReturnValue([]),
        save: jest.fn()
    }

    const service = new TicketService(storage);

    const ticket = service.createTicket(
        "Fix login bug",
        "Users cannot log in",
        "high",
        ["backend"]
    );
    
    expect(ticket.title).toBe("Fix login bug");
    expect(ticket.description).toBe("Users cannot log in");
    expect(ticket.status).toBe("open");
    expect(ticket.priority).toBe("high");
    expect(ticket.tags).toEqual(["backend"]);
})

test("generates a unique ID for each ticket", () => {
    const tickets = [];

    const storage = {
        load: jest.fn(() => tickets),
        save: jest.fn((newTickets) => {
            tickets.length = 0;
            tickets.push(...newTickets);
        })
    };

    const service = new TicketService(storage);

    const ticket1 = service.createTicket(
        "Fix login bug",
        "Users cannot log in",
        "high",
        ["backend"]
    );

    const ticket2 = service.createTicket(
        "Fix logout bug",
        "Users cannot log out",
        "medium",
        ["backend"]
    );

    expect(ticket1.id).not.toBe(ticket2.id);
})