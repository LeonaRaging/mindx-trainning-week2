import fs from "fs";
import path from "path";
import type { KBClient } from "../services/kb-client";

function requiredOption(args: string[], option: string): string {
    const index = args.indexOf(option);
    const value = index >= 0 ? args[index + 1] : undefined;

    if (!value || value.startsWith("--")) {
        throw new Error(`Missing value for ${option}`);
    }

    return value;
}

function numericOption(
    args: string[],
    option: string,
    defaultValue: number
): number {
    const value = args.indexOf(option) >= 0
        ? Number(requiredOption(args, option))
        : defaultValue;

    if (!Number.isInteger(value) || value < 1) {
        throw new Error(`${option} must be a positive integer`);
    }

    return value;
}

function printDocument(document: {
    id: string;
    title: string;
    content: string;
    nodePath: string;
    tags: string[];
}): void {
    console.log(`${document.id}: ${document.title}`);
    console.log(`Node: ${document.nodePath}`);
    console.log(`Tags: ${document.tags.join(", ")}`);
}

export async function searchKnowledgeBase(
    client: KBClient,
    args: string[]
): Promise<void> {
    const query = args[0];

    if (!query || query.startsWith("--")) {
        throw new Error("Search query is required");
    }

    const topK = numericOption(args, "--top-k", 5);
    const documents = await client.search(query, topK);

    for (const document of documents) {
        printDocument(document);
    }
}

export async function listKnowledgeBase(
    client: KBClient,
    args: string[]
): Promise<void> {
    const nodePath = requiredOption(args, "--node");
    const limit = numericOption(args, "--limit", 10);
    const documents = await client.list(nodePath, limit);

    for (const document of documents) {
        printDocument(document);
    }
}

export async function retrieveKnowledgeBase(
    client: KBClient,
    args: string[]
): Promise<void> {
    const docId = args[0];

    if (!docId || docId.startsWith("--")) {
        throw new Error("Document ID is required");
    }

    const document = await client.retrieve(docId);

    printDocument(document);
    console.log(`Content: ${document.content}`);
}

export async function addKnowledgeBase(
    client: KBClient,
    args: string[]
): Promise<void> {
    const filePath = requiredOption(args, "--file");
    const nodePath = requiredOption(args, "--path");
    const tags = requiredOption(args, "--tags")
        .split(",")
        .map(tag => tag.trim())
        .filter(Boolean);

    if (tags.length === 0) {
        throw new Error("--tags must contain at least one tag");
    }

    const content = fs.readFileSync(filePath, "utf-8");
    const title = path.basename(filePath, path.extname(filePath));
    const document = await client.add({
        title,
        content,
        nodePath,
        tags
    });

    printDocument(document);
}
