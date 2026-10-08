import type { KBClient } from "./kb-client";
import HTTPKBClient, { type FetchImplementation } from "./http-kb-client";
import MockKBClient from "./mock-kb-client";

export interface KBClientEnvironment {
    KB_CLIENT?: string;
    KB_API_URL?: string;
}

export default function createKBClient(
    environment: KBClientEnvironment = process.env,
    fetchImplementation?: FetchImplementation
): KBClient {
    const clientType = environment.KB_CLIENT || "mock";

    if (clientType === "mock") {
        return new MockKBClient();
    }

    if (clientType === "http") {
        const apiUrl = environment.KB_API_URL;

        if (!apiUrl) {
            throw new Error("KB_API_URL is required when KB_CLIENT is http");
        }

        return new HTTPKBClient(apiUrl, fetchImplementation);
    }

    throw new Error(`Unknown KB client: ${clientType}`);
}
