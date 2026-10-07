import MockKBClient from "../../src/services/mock-kb-client";

test("searches documents by title or content", async () => {
    const client = new MockKBClient();

    const results = await client.search("response", 3);

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe("doc-001");
});