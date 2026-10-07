# Ticket Manager CLI

A small command-line application for managing tickets stored in a local JSON file. The project was built as a TDD exercise to practice test-first development, CLI command design, and separation of responsibilities across command, service, model, and storage layers.

## Overview

This project lets you:

- Create new tickets with a title, description, status, priority, and tags
- List tickets with optional filters
- View a single ticket by ID
- Update a ticket's status
- Persist ticket data to a JSON file locally

It follows a simple architecture:

- `src/commands/` handles CLI arguments and prints output
- `src/services/` contains the ticket business logic
- `src/models/` contains validation rules
- `src/storage/` handles JSON read/write operations

## Features

### Ticket validation

The application validates the following:

- Title is required and must be under 100 characters
- Description is required
- Status must be one of: `open`, `in_progress`, `closed`
- Priority must be one of: `low`, `medium`, `high`
- Tags must be stored as an array

### Supported commands

```bash
npm start -- tickets create "<title>" "<description>" "<priority>" "<tag1>" "<tag2>"
npm start -- tickets list
npm start -- tickets list --status <status>
npm start -- tickets list --priority <priority>
npm start -- tickets list --tag <tag>
npm start -- tickets show <ticket_id>
npm start -- tickets update <ticket_id> --status <status>
```

## Installation

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

## Usage

### Create a ticket

```bash
npm start -- tickets create "<title>" "<description>" "<priority>" "<tag1>" "<tag2>"
```

Example:

```bash
npm start -- tickets create "Fix login bug" "Users cannot log in" high backend
```

This creates a ticket with a default status of `open` and stores the provided priority and tags.

### List tickets

```bash
npm start -- tickets list
```

Optional filters:

```bash
npm start -- tickets list --status <status>
npm start -- tickets list --priority <priority>
npm start -- tickets list --tag <tag>
```

You can also combine filters:

```bash
npm start -- tickets list --tag <tag> --priority <priority>
```

### Show a ticket

```bash
npm start -- tickets show <ticket_id>
```

This prints all ticket details, including ID, title, description, status, priority, and tags.

### Update a ticket status

```bash
npm start -- tickets update <ticket_id> --status <status>
```

Valid status values are:

- `open`
- `in_progress`
- `closed`

## Data storage

By default, ticket data is stored in:

```bash
data/tickets.tson
```

You can override the storage file path with the `TICKETS_FILE` environment variable:

```bash
TICKETS_FILE=data/custom-tickets.json npm start -- tickets list
```

## Project structure

```text
.
├── cli.ts
├── package.tson
├── overview.md
├── data/
│   └── tickets.tson
├── src/
│   ├── commands/
│   │   └── ticket-commands.ts
│   ├── models/
│   │   └── ticket.ts
│   ├── services/
│   │   └── ticket-service.ts
│   └── storage/
│       └── json-storage.ts
├── tests/
│   ├── integration/
│   │   └── cli.test.ts
│   └── unit/
│       └── ticket-service.test.ts
└── README.md
```

## Testing

This project uses Jest for unit and integration testing.

Run the test suite with:

```bash
npm test
```

The tests cover:

- ticket creation
- ID generation
- ticket listing and filtering
- reading a ticket by ID
- invalid ticket data
- invalid status updates
- CLI command behavior

## TDD workflow

The project follows a Red-Green-Refactor approach:

1. Write a failing test for the expected behavior
2. Implement the minimum code to pass the test
3. Refactor for clarity and maintainability
4. Repeat for the next feature

This makes the application a practical example of structured, test-driven CLI development.

## Notes

This is a training project focused on practicing TDD and CLI architecture. The implementation is intentionally simple and designed to be easy to understand and extend.
