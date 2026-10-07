import MockKBClient from "../../src/services/mock-kb-client";

test("searches documents by title or content", async () => {
    const client = new MockKBClient();

    const results = await client.search("response", 3);

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe("doc-001");
});

test("lists documents in a node", async () => {
    const client = new MockKBClient();

    const results = await client.list("/templates/email", 10);

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe("doc-001");
});

test("retrieves a document by ID", async () => {
    const client = new MockKBClient();

    const document = await client.retrieve("doc-001");

    expect(document.title).toBe("Customer Response Template");
    expect(document.nodePath).toBe("/templates/email");
});

test("throws when retrieving an unknown document", async () => {
    const client = new MockKBClient();

    await expect(client.retrieve("missing-doc")).rejects.toThrow(
        "Document not found"
    );
});

test("adds a new document", async () => {
    const client = new MockKBClient();

    const document = await client.add({
        title: "SMS Template",
        content: "A short SMS response.",
        nodePath: "/templates/sms",
        tags: ["template", "sms"]
    });

    expect(document.id).toBe("doc-003");
    expect(document.title).toBe("SMS Template");

    const retrieved = await client.retrieve("doc-003");
    expect(retrieved).toEqual(document);
});