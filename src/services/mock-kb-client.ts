import type { Document } from "../models/document";
import type { KBClient } from "./kb-client";

export default class MockKBClient implements KBClient {
    private documents: Document[] = [
        {
            id: "doc-001",
            title: "Customer Response Template",
            content: "Template for responding to customer requests.",
            nodePath: "/templates/email",
            tags: ["template", "email"]
        },
        {
            id: "doc-002",
            title: "DevOps On-Call Schedule",
            content: "Weekly team support schedule.",
            nodePath: "/team/devops",
            tags: ["team", "devops"]
        }
    ];

    async search(query: string, topK = 5): Promise<Document[]> {
        const normalizedQuery = query.toLocaleLowerCase();

        return this.documents
            .filter(document =>
                `${document.title} ${document.content}`
                    .toLocaleLowerCase()
                    .includes(normalizedQuery)
            )
            .slice(0, topK);
    }

    async list(nodePath: string, limit = 10): Promise<Document[]> {
        return this.documents
            .filter(document => document.nodePath === nodePath)
            .slice(0, limit);
    }

    async retrieve(docId: string): Promise<Document> {
        const document = this.documents.find(item => item.id === docId);

        if (!document) {
            throw new Error("Document not found");
        }

        return document;
    }

    async add(input: Omit<Document, "id">): Promise<Document> {
        const document: Document = {
            id: `doc-${String(this.documents.length + 1).padStart(3, "0")}`,
            ...input
        };

        this.documents.push(document);
        return document;
    }
}