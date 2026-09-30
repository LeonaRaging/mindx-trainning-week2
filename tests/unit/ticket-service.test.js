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

test("lists all tickets", () => {
    const tickets = [
        {
            id: 1,
            title: "Fix login",
            description: "Login is broken",
            status: "open",
            priority: "high",
            tags: ["backend"]
        },
        {
            id: 2,
            title: "Fix button",
            description: "Button does not work",
            status: "closed",
            priority: "low",
            tags: ["frontend"]
        }
    ];

    const storage = {
        load: () => tickets,
        save: () => {}
    };

    const service = new TicketService(storage);

    const result = service.listTickets();

    expect(result).toEqual(tickets);
});

test("filters tickets by status", () => {
    const tickets = [
        {
            id: 1,
            title: "Fix login",
            description: "Login is broken",
            status: "open",
            priority: "high",
            tags: ["backend"]
        },
        {
            id: 2,
            title: "Fix button",
            description: "Button does not work",
            status: "closed",
            priority: "low",
            tags: ["frontend"]
        },
        {
            id: 3,
            title: "Fix API",
            description: "API returns wrong data",
            status: "open",
            priority: "medium",
            tags: ["backend"]
        }
    ];

    const storage = {
        load: () => tickets,
        save: () => {}
    };

    const service = new TicketService(storage);

    const result = service.listTickets({ status: "open" });

    expect(result).toEqual([tickets[0], tickets[2]]);
});

test("filters tickets by priority", () => {
    const tickets = [
        {
            id: 1,
            title: "Fix login",
            description: "Login is broken",
            status: "open",
            priority: "high",
            tags: []
        },
        {
            id: 2,
            title: "Fix button",
            description: "Button does not work",
            status: "open",
            priority: "low",
            tags: []
        },
        {
            id: 3,
            title: "Fix API",
            description: "API returns wrong data",
            status: "closed",
            priority: "high",
            tags: []
        }
    ];

    const storage = {
        load: () => tickets,
        save: () => {}
    };

    const service = new TicketService(storage);

    const result = service.listTickets({ priority: "high" });

    expect(result).toEqual([tickets[0], tickets[2]]);
});

test("filters tickets by tag", () => {
    const tickets = [
        {
            id: 1,
            title: "Fix login",
            description: "Login is broken",
            status: "open",
            priority: "high",
            tags: ["backend", "security"]
        },
        {
            id: 2,
            title: "Fix button",
            description: "Button does not work",
            status: "open",
            priority: "low",
            tags: ["frontend"]
        }
    ];

    const storage = {
        load: () => tickets,
        save: () => {}
    };

    const service = new TicketService(storage);

    const result = service.listTickets({ tag: "backend" });

    expect(result).toEqual([tickets[0]]);
});

test("gets a ticket by ID", () => {
    const tickets = [
        {
            id: 1,
            title: "Fix login",
            description: "Login is broken",
            status: "open",
            priority: "high",
            tags: ["backend"]
        },
        {
            id: 2,
            title: "Fix button",
            description: "Button does not work",
            status: "closed",
            priority: "low",
            tags: ["frontend"]
        }
    ];

    const storage = {
        load: () => tickets,
        save: () => {}
    };

    const service = new TicketService(storage);

    const result = service.getTicket(2);

    expect(result).toEqual(tickets[1]);
});

test("throws an error when ticket does not exist", () => {
    const storage = {
        load: () => [],
        save: () => {}
    };

    const service = new TicketService(storage);

    expect(() => service.getTicket(999))
        .toThrow("Ticket not found");
});