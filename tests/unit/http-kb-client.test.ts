import HTTPKBClient from "../../src/services/http-kb-client";

const document = {
    id: "doc-001",
    title: "Customer Response Template",
    content: "Template content",
    nodePath: "/templates/email",
    tags: ["template", "email"]
};

function response(payload: unknown, ok = true, status = 200): Response {
    return {
        ok,
        status,
        json: jest.fn().mockResolvedValue(payload)
    } as unknown as Response;
}

test("searches documents with the expected HTTP request", async () => {
    const fetchMock = jest.fn().mockResolvedValue(response({ results: [document] }));
    const client = new HTTPKBClient("http://kb.example/", fetchMock);

    await expect(client.search("response", 3)).resolves.toEqual([document]);
    expect(fetchMock).toHaveBeenCalledWith(
        "http://kb.example/search",
        expect.objectContaining({
            method: "POST",
            body: JSON.stringify({ query: "response", topK: 3 })
        })
    );
});

test("lists documents with the expected request body", async () => {
    const fetchMock = jest.fn().mockResolvedValue(response({ results: [document] }));
    const client = new HTTPKBClient("http://kb.example", fetchMock);

    await expect(client.list("/templates/email", 10)).resolves.toEqual([document]);
    expect(fetchMock).toHaveBeenCalledWith(
        "http://kb.example/list",
        expect.objectContaining({
            body: JSON.stringify({ nodePath: "/templates/email", limit: 10 })
        })
    );
});

test("retrieves and adds documents", async () => {
    const fetchMock = jest
        .fn()
        .mockResolvedValueOnce(response({ document }))
        .mockResolvedValueOnce(response({ document }));
    const client = new HTTPKBClient("http://kb.example", fetchMock);

    await expect(client.retrieve("doc-001")).resolves.toEqual(document);
    await expect(client.add({
        title: "New document",
        content: "Content",
        nodePath: "/docs",
        tags: ["guide"]
    })).resolves.toEqual(document);

    expect(fetchMock.mock.calls[0][0]).toBe("http://kb.example/retrieve");
    expect(fetchMock.mock.calls[1][0]).toBe("http://kb.example/add");
});

test("surfaces HTTP errors", async () => {
    const client = new HTTPKBClient(
        "http://kb.example",
        jest.fn().mockResolvedValue(response({}, false, 503))
    );

    await expect(client.search("response")).rejects.toThrow(
        "KB API request failed with status 503"
    );
});

test("surfaces network errors", async () => {
    const client = new HTTPKBClient(
        "http://kb.example",
        jest.fn().mockRejectedValue(new Error("connection refused"))
    );

    await expect(client.search("response")).rejects.toThrow(
        "KB API request failed: connection refused"
    );
});

test("rejects malformed API responses", async () => {
    const fetchMock = jest.fn().mockResolvedValue(response({ results: [{}] }));
    const client = new HTTPKBClient("http://kb.example", fetchMock);

    await expect(client.search("response")).rejects.toThrow(
        "Invalid search response from KB API"
    );
});
