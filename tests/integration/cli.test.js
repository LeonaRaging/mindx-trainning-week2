const fs = require("fs");
const { execFileSync } = require("child_process");

const testFilePath = "data/test-tickets.json";

beforeEach(() => {
    fs.writeFileSync(
        testFilePath,
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
            },
            {
                id: 3,
                title: "Update UI",
                description: "change UI",
                status: "open",
                priority: "high",
                tags: ["frontend"]
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
        { 
            encoding: "utf-8",
            env : {
                ...process.env,
                TICKETS_FILE: testFilePath
            }
        },
    );

    expect(output).toContain("Ticket created");
});

test("lists tickets through the CLI", () => {
    const output = execFileSync(
        "node",
        ["cli.js", "tickets", "list"],
        { 
            encoding: "utf-8",
            env : {
                ...process.env,
                TICKETS_FILE: testFilePath
            } 
        }
    );

    expect(output).toContain("Fix login");
});

test("lists multiple tickets through the CLI", () => {
    const output = execFileSync(
        "node",
        ["cli.js", "tickets", "list"],
        { 
            encoding: "utf-8",
            env : {
                ...process.env,
                TICKETS_FILE: testFilePath
            }
        }
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
        { 
            encoding: "utf-8",
            env : {
                ...process.env,
                TICKETS_FILE: testFilePath
            }
         }
    );

    expect(output).toContain("Fix login");
    expect(output).not.toContain("Fix logout");
});

test("filters tickets by tag and priority", () => {
    const output = execFileSync(
        "node",
        [
            "cli.js",
            "tickets",
            "list",
            "--tag",
            "backend",
            "--priority",
            "high"
        ],
        {
            encoding: "utf-8",
            env: {
                ...process.env,
                TICKETS_FILE: testFilePath
            }
        }
    );

    expect(output).toContain("Fix login");
    expect(output).not.toContain("Fix logout");
    expect(output).not.toContain("Update UI");
});

test("shows a ticket by ID", () => {
    const output = execFileSync(
        "node",
        [
            "cli.js",
            "tickets",
            "show",
            "1"
        ],
        {
            encoding: "utf-8",
            env: {
                ...process.env,
                TICKETS_FILE: testFilePath
            }
        }
    );

    expect(output).toContain("Fix login");
    expect(output).toContain("Users cannot log in");
    expect(output).toContain("open");
    expect(output).toContain("high");
    expect(output).toContain("backend");
});

test("updates a ticket status", () => {
    const output = execFileSync(
        "node",
        [
            "cli.js",
            "tickets",
            "update",
            "1",
            "--status",
            "closed"
        ],
        {
            encoding: "utf-8",
            env: {
                ...process.env,
                TICKETS_FILE: testFilePath
            }
        }
    );

    expect(output).toContain("Ticket updated");

    const tickets = JSON.parse(
        fs.readFileSync(testFilePath, "utf-8")
    );

    expect(tickets[0].status).toBe("closed");
});

test("throws for an unknown ticket command", () => {
    expect(() => execFileSync(
        "node",
        ["cli.js", "tickets", "unknown"],
        {
            encoding: "utf-8",
            env: {
                ...process.env,
                TICKETS_FILE: testFilePath
            }
        }
    )).toThrow(/Unknown ticket command/);
});

test("throws for an invalid status update", () => {
    expect(() => execFileSync(
        "node",
        ["cli.js", "tickets", "update", "1", "--status", "archived"],
        {
            encoding: "utf-8",
            env: {
                ...process.env,
                TICKETS_FILE: testFilePath
            }
        }
    )).toThrow(/Invalid ticket status/);
});

afterEach(() => {
    if (fs.existsSync(testFilePath)) {
        fs.unlinkSync(testFilePath)
    }
})