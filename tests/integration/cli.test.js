const { execFileSync } = require("child_process");

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