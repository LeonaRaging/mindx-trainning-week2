import createKBClient from "../../src/services/create-kb-client";
import HTTPKBClient from "../../src/services/http-kb-client";
import MockKBClient from "../../src/services/mock-kb-client";

test("uses the mock client by default", () => {
    expect(createKBClient({})).toBeInstanceOf(MockKBClient);
});

test("creates an HTTP client from environment configuration", () => {
    expect(createKBClient({
        KB_CLIENT: "http",
        KB_API_URL: "http://kb.example"
    })).toBeInstanceOf(HTTPKBClient);
});

test("requires an API URL for the HTTP client", () => {
    expect(() => createKBClient({ KB_CLIENT: "http" })).toThrow(
        "KB_API_URL is required when KB_CLIENT is http"
    );
});

test("rejects unknown client types", () => {
    expect(() => createKBClient({ KB_CLIENT: "unknown" })).toThrow(
        "Unknown KB client: unknown"
    );
});
