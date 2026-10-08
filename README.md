# Ticket and Knowledge Base CLI

A small command-line application for managing tickets stored in a local JSON file and querying a Knowledge Base over a simple HTTP API. The project was built as a TDD exercise to practice test-first development, CLI command design, and separation of responsibilities across command, service, model, and storage layers.

## Overview

This project lets you:

- Create new tickets with a title, description, status, priority, and tags
- List tickets with optional filters
- View a single ticket by ID
- Update a ticket's status
- Persist ticket data to a JSON file locally
- Search, list, retrieve, and add Knowledge Base documents

It follows a simple architecture:

- `src/commands/` handles CLI arguments and prints output
- `src/services/` contains the ticket business logic
- `src/models/` contains validation rules
- `src/storage/` handles JSON read/write operations
- `src/services/kb-client.ts` defines the Knowledge Base client contract
- `src/services/mock-kb-client.ts` provides safe local Knowledge Base data
- `src/services/http-kb-client.ts` connects to a real Knowledge Base API
- `src/services/create-kb-client.ts` selects the client from environment variables

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

Knowledge Base commands:

```bash
npm start -- kb search "<query>" --top-k <number>
npm start -- kb list --node <node_path> --limit <number>
npm start -- kb retrieve <document_id>
npm start -- kb add --file <file> --path <node_path> --tags <tag1,tag2>
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

### Search Knowledge Base documents

The default client is the local mock client, so this command does not require a
running server:

```bash
KB_CLIENT=mock npm start -- kb search response --top-k 3
```

### List documents in a node

```bash
KB_CLIENT=mock npm start -- kb list \
  --node /templates/email \
  --limit 10
```

### Retrieve a document

```bash
KB_CLIENT=mock npm start -- kb retrieve doc-001
```

### Add a document

The file contents become the document content. The filename without its
extension becomes the document title.

```bash
printf 'A short SMS response.' > /tmp/new-template.md

KB_CLIENT=mock npm start -- kb add \
  --file /tmp/new-template.md \
  --path /templates/sms \
  --tags template,sms
```

## Knowledge Base client configuration

The CLI supports two Knowledge Base clients:

| `KB_CLIENT` | Description |
| --- | --- |
| `mock` or unset | Uses in-memory documents for local development and tests |
| `http` | Sends requests to the configured Knowledge Base API |

Use the mock client by default:

```bash
npm start -- kb search response
```

Use the HTTP client by setting both environment variables:

```bash
KB_CLIENT=http \
KB_API_URL=http://localhost:3000 \
npm start -- kb search response --top-k 3
```

`KB_API_URL` is required when `KB_CLIENT=http`. The HTTP client sends JSON
`POST` requests to these endpoints:

| Command | Endpoint | Request body |
| --- | --- | --- |
| `kb search` | `/search` | `{ "query": "...", "topK": 5 }` |
| `kb list` | `/list` | `{ "nodePath": "...", "limit": 10 }` |
| `kb retrieve` | `/retrieve` | `{ "docId": "doc-001" }` |
| `kb add` | `/add` | `{ "title": "...", "content": "...", "nodePath": "...", "tags": ["..."] }` |

Search and list responses must contain a `results` array of complete document
objects. Retrieve and add responses may contain a document directly or under
a `document` property. Failed HTTP requests, network errors, invalid JSON, and
malformed responses are reported to the CLI.

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
│   │   ├── kb-commands.ts
│   │   └── ticket-commands.ts
│   ├── models/
│   │   ├── document.ts
│   │   └── ticket.ts
│   ├── services/
│   │   ├── create-kb-client.ts
│   │   ├── http-kb-client.ts
│   │   ├── kb-client.ts
│   │   ├── mock-kb-client.ts
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
- mock Knowledge Base search, list, retrieve, and add operations
- HTTP Knowledge Base requests and response validation
- Knowledge Base client selection from environment variables

Run the build and full test suite with:

```bash
npm run build
npm test
```

## TDD workflow

The project follows a Red-Green-Refactor approach:

1. Write a failing test for the expected behavior
2. Implement the minimum code to pass the test
3. Refactor for clarity and maintainability
4. Repeat for the next feature

This makes the application a practical example of structured, test-driven CLI development.

## Notes

This is a training project focused on practicing TDD and CLI architecture. The implementation is intentionally simple and designed to be easy to understand and extend.
