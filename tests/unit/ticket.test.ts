export {};

const { validateTicket } = require("../../src/models/ticket");

describe("Ticket validation", () => {
    test("accepts a valid ticket", () => {
        const ticket = {
            title: "Fix login bug",
            description: "Users cannot log in",
            status: "Open",
            priority: "high",
            tags: ["backend"]
        };

        expect(() => validateTicket(ticket).not.toThrow());
    })
    
    test("rejects a ticket with an empty title", () => {
        const ticket = {
            title: "",
            description: "Fix login bug",
            status: "open",
            priority: "high",
            tags: []
        }
    
        expect(() => validateTicket(ticket)).toThrow();
    });

    test("rejects a whitespace-only title", () => {
        const ticket = {
            title: "   ",
            description: "Users cannot log in",
            status: "open",
            priority: "high",
            tags: []
        };

        expect(() => validateTicket(ticket)).toThrow();
    });

    test("rejects a title longer than 100 characters", () => {
        const ticket = {
            title: "a".repeat(101),
            description: "Users cannot log in",
            status: "open",
            priority: "high",
            tags: []
        };

        expect(() => validateTicket(ticket)).toThrow();
    });

    test("accepts a title exactly 100 characters long", () => {
        const ticket = {
            title: "a".repeat(100),
            description: "Users cannot log in",
            status: "open",
            priority: "high",
            tags: []
        };

        expect(() => validateTicket(ticket)).not.toThrow();
    });

    test("rejects an empty description", () => {
        const ticket = {
            title: "Fix login bug",
            description: "",
            status: "open",
            priority: "high",
            tags: []
        };

        expect(() => validateTicket(ticket)).toThrow();
    });

    test("rejects an invalid status", () => {
        const ticket = {
            title: "Fix login bug",
            description: "Users cannot log in",
            status: "invalid",
            priority: "high",
            tags: []
        };

        expect(() => validateTicket(ticket)).toThrow();
    });

    test("accepts all valid statuses", () => {
        for (const status of ["open", "in_progress", "closed"]) {
            const ticket = {
                title: "Fix login bug",
                description: "Users cannot log in",
                status,
                priority: "high",
                tags: []
            };

            expect(() => validateTicket(ticket)).not.toThrow();
        }
    });

    test("rejects an invalid priority", () => {
        const ticket = {
            title: "Fix login bug",
            description: "Users cannot log in",
            status: "open",
            priority: "urgent",
            tags: []
        };

        expect(() => validateTicket(ticket)).toThrow();
    });

    test("accepts all valid priorities", () => {
        for (const priority of ["low", "medium", "high"]) {
            const ticket = {
                title: "Fix login bug",
                description: "Users cannot log in",
                status: "open",
                priority,
                tags: []
            };

            expect(() => validateTicket(ticket)).not.toThrow();
        }
    });

    test("rejects tags when they are not an array", () => {
        const ticket = {
            title: "Fix login bug",
            description: "Users cannot log in",
            status: "open",
            priority: "high",
            tags: "backend"
        };

        expect(() => validateTicket(ticket)).toThrow();
    });

    test("accepts an empty tag list", () => {
        const ticket = {
            title: "Fix login bug",
            description: "Users cannot log in",
            status: "open",
            priority: "high",
            tags: []
        };

        expect(() => validateTicket(ticket)).not.toThrow();
    });
})