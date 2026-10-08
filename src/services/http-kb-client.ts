import type { Document } from "../models/document";
import type { KBClient } from "./kb-client";

type FetchImplementation = (
    input: string | URL,
    init?: RequestInit
) => Promise<Response>;

function isDocument(value: unknown): value is Document {
    if (!value || typeof value !== "object") {
        return false;
    }

    const document = value as Record<string, unknown>;

    return typeof document.id === "string"
        && typeof document.title === "string"
        && typeof document.content === "string"
        && typeof document.nodePath === "string"
        && Array.isArray(document.tags)
        && document.tags.every(tag => typeof tag === "string");
}

export default class HTTPKBClient implements KBClient {
    private readonly fetchImplementation: FetchImplementation;

    constructor(
        private readonly baseUrl: string,
        fetchImplementation: FetchImplementation = fetch
    ) {
        if (!baseUrl.trim()) {
            throw new Error("KB API URL is required");
        }

        this.baseUrl = baseUrl.replace(/\/+$/, "");
        this.fetchImplementation = fetchImplementation;
    }

    async search(query: string, topK = 5): Promise<Document[]> {
        const response = await this.post("/search", { query, topK });
        return this.documentsFromResponse(response, "search");
    }

    async list(nodePath: string, limit = 10): Promise<Document[]> {
        const response = await this.post("/list", { nodePath, limit });
        return this.documentsFromResponse(response, "list");
    }

    async retrieve(docId: string): Promise<Document> {
        const response = await this.post("/retrieve", { docId });
        const document = response.document ?? response;

        if (!isDocument(document)) {
            throw new Error("Invalid retrieve response from KB API");
        }

        return document;
    }

    async add(input: Omit<Document, "id">): Promise<Document> {
        const response = await this.post("/add", input);
        const document = response.document ?? response;

        if (!isDocument(document)) {
            throw new Error("Invalid add response from KB API");
        }

        return document;
    }

    private async post(
        endpoint: string,
        body: Record<string, unknown>
    ): Promise<Record<string, unknown>> {
        let response: Response;

        try {
            response = await this.fetchImplementation(
                `${this.baseUrl}${endpoint}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                }
            );
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`KB API request failed: ${message}`);
        }

        if (!response.ok) {
            throw new Error(
                `KB API request failed with status ${response.status}`
            );
        }

        let payload: unknown;

        try {
            payload = await response.json();
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`Invalid JSON response from KB API: ${message}`);
        }

        if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
            throw new Error("Invalid response from KB API");
        }

        return payload as Record<string, unknown>;
    }

    private documentsFromResponse(
        response: Record<string, unknown>,
        operation: string
    ): Document[] {
        const results = response.results;

        if (!Array.isArray(results) || !results.every(isDocument)) {
            throw new Error(`Invalid ${operation} response from KB API`);
        }

        return results;
    }
}