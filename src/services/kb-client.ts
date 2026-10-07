import type { Document } from "../models/document"

export interface KBClient {
    search(query: string, topK?: number): Document[];
    list(nodePath: string, limit?: number): Document[];
    retrieve(docId: string): Document;
    add(document: Omit<Document, "id">): Document;
}