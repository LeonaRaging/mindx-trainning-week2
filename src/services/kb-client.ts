import type { Document } from "../models/document"

export interface KBClient {
    search(query: string, topK?: number): Promise<Document[]>;
    list(nodePath: string, limit?: number): Promise<Document[]>;
    retrieve(docId: string): Promise<Document>;
    add(document: Omit<Document, "id">): Promise<Document>;
}