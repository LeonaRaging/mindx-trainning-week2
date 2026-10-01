const fs = require("fs");
const { execFileSync } = require("child_process");

const filePath = "data/tickets.json";

beforeEach(() => {
    fs.writeFileSync(
        filePath,
        JSON.stringify([
            {
                id: 1,
                title: "Fix login",
                description: "Users cannot log in",
                status: "open",
                priority: "high",
                tags: ["backend"]
            },
            {
                id: 2,
                title: "Fix logout",
                description: "Users cannot log out",
                status: "closed",
                priority: "medium",
                tags: ["backend"]
            }
        ])
    );
});

test("creates a ticket from the CLI", () => {
    const output = execFileSync(
        "node",
        [
            "cli.js",
            "tickets",
            "create",
            "Fix login",
            "Users cannot log in",
            "high",
            "backend"
        ],
        { encoding: "utf-8" }
    );

    expect(output).toContain("Ticket created");
});

test("lists tickets through the CLI", () => {
    const output = execFileSync(
        "node",
        ["cli.js", "tickets", "list"],
        { encoding: "utf-8" }
    );

    expect(output).toContain("Fix login");
});

test("lists multiple tickets through the CLI", () => {
    const output = execFileSync(
        "node",
        ["cli.js", "tickets", "list"],
        { encoding: "utf-8" }
    );

    expect(output).toContain("Fix login");
    expect(output).toContain("Fix logout");
});

test("lists only tickets with the requested status", () => {
    const output = execFileSync(
        "node",
        [
            "cli.js",
            "tickets",
            "list",
            "--status",
            "open"
        ],
        { encoding: "utf-8" }
    );

    expect(output).toContain("Fix login");
    expect(output).not.toContain("Fix logout");
});