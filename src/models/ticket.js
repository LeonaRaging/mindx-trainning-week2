function validateTicket(ticket) {
    if (!ticket.title || ticket.title.trim() === "") {
        throw new Error("Title is required");
    }

    if (ticket.title.length > 100) {
        throw new Error("Ticket length can't exceed 100 characters");
    }

    if (!ticket.description || ticket.description.trim() === "") {
        throw new Error("Description is required");
    }

    if (!["open", "closed", "in_progress"].includes(ticket.status)) {
        throw new Error("Invalid status");
    }

    if (!["low", "medium", "high"].includes(ticket.priority)) {
        throw new Error("Invalid priority");
    }

    if (!Array.isArray(ticket.tags)) {
        throw new Error("Tags aren't array");
    }
}

module.exports = {
    validateTicket
};