import fs from "fs";
import { execFileSync } from "child_process";

const testDocumentPath = "data/test-kb-document.md";

function runKbCommand(args: string[]): string {
    return execFileSync(
        "node",
        ["dist/cli.js", "kb", ...args],
        {
            encoding: "utf-8",
            env: {
                ...process.env,
                KB_CLIENT: "mock"
            }
        }
    );
}

afterEach(() => {
    if (fs.existsSync(testDocumentPath)) {
        fs.unlinkSync(testDocumentPath);
    }
});

test("searches knowledge base documents through the CLI", () => {
    const output = runKbCommand(["search", "response", "--top-k", "3"]);

    expect(output).toContain("doc-001");
    expect(output).toContain("Customer Response Template");
});

test("lists knowledge base documents through the CLI", () => {
    const output = runKbCommand([
        "list",
        "--node",
        "/templates/email",
        "--limit",
        "10"
    ]);

    expect(output).toContain("doc-001");
    expect(output).toContain("Customer Response Template");
});

test("retrieves a knowledge base document through the CLI", () => {
    const output = runKbCommand(["retrieve", "doc-001"]);

    expect(output).toContain("Customer Response Template");
    expect(output).toContain("Template for responding to customer requests.");
    expect(output).toContain("/templates/email");
});

test("adds a knowledge base document through the CLI", () => {
    fs.writeFileSync(
        testDocumentPath,
        "A short SMS response."
    );

    const output = runKbCommand([
        "add",
        "--file",
        testDocumentPath,
        "--path",
        "/templates/sms",
        "--tags",
        "template,sms"
    ]);

    expect(output).toContain("doc-003");
    expect(output).toContain("SMS");
});

test("reports an error when retrieving an unknown document", () => {
    expect(() => runKbCommand(["retrieve", "missing-doc"])).toThrow(
        /Document not found/
    );
});
