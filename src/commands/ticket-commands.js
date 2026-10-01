function createTicket(service, args) {
    const title = args[2];
    const description = args[3];
    const priority = args[4];
    const tags = args.slice(5);

    service.createTicket(
        title,
        description,
        priority,
        tags
    );

    console.log("Ticket created");
}

function listTickets(service, args) {
    const filters = {};

    for (let i = 2; i < args.length; i++) {
        if (args[i] === "--status") {
            filters.status = args[i + 1];
        }

        if (args[i] === "--priority") {
            filters.priority = args[i + 1];
        }

        if (args[i] === "--tag") {
            filters.tag = args[i + 1];
        }
    }

    const tickets = service.listTickets(filters);

    for (const ticket of tickets) {
        console.log(`${ticket.id}: ${ticket.title}`);
    }
}

function showTicket(service, args) {
    const id = Number(args[2]);
    const ticket = service.getTicket(id);

    console.log(`ID: ${ticket.id}`);
    console.log(`Title: ${ticket.title}`);
    console.log(`Description: ${ticket.description}`);
    console.log(`Status: ${ticket.status}`);
    console.log(`Priority: ${ticket.priority}`);
    console.log(`Tags: ${ticket.tags.join(", ")}`);
}

function updateTicket(service, args) {
    const id = Number(args[2]);

    let status;

    if (args[3] === "--status") {
        status = args[4];
    }

    service.updateStatus(id, status);

    console.log("Ticket updated");
}

module.exports = {
    createTicket,
    listTickets,
    showTicket,
    updateTicket
};