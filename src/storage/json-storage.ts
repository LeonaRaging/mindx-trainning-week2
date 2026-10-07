import * as fs from "node:fs";
import type { Ticket } from "../models/ticket";

export interface Storage {
    load(): Ticket[];
    save(tickets: Ticket[]): void;
}

export default class JsonStorage implements Storage {
    constructor(private readonly filePath: string) {
    }

    load(): Ticket[] {
        if (!fs.existsSync(this.filePath)) {
            return [];
        }

        const data = fs.readFileSync(this.filePath, "utf-8");
        return JSON.parse(data);
    }

    save(tickets: Ticket[]): void {
        fs.writeFileSync(
            this.filePath,
            JSON.stringify(tickets, null, 2)
        );
    }
}