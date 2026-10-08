const http = require("http");

const documents = [
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

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json"
  });
  response.end(JSON.stringify(body));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let data = "";

    request.on("data", chunk => {
      data += chunk;
    });

    request.on("end", () => {
      try {
        resolve(JSON.parse(data || "{}"));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });

    request.on("error", reject);
  });
}

const server = http.createServer(async (request, response) => {
  if (request.method !== "POST") {
    sendJson(response, 405, { error: "Only POST is supported" });
    return;
  }

  try {
    const body = await readBody(request);

    if (request.url === "/search") {
      const query = String(body.query || "").toLowerCase();
      const topK = Number(body.topK || 5);

      const results = documents
        .filter(document =>
          `${document.title} ${document.content}`
            .toLowerCase()
            .includes(query)
        )
        .slice(0, topK);

      sendJson(response, 200, { results });
      return;
    }

    if (request.url === "/list") {
      const limit = Number(body.limit || 10);

      const results = documents
        .filter(document => document.nodePath === body.nodePath)
        .slice(0, limit);

      sendJson(response, 200, { results });
      return;
    }

    if (request.url === "/retrieve") {
      const document = documents.find(item => item.id === body.docId);

      if (!document) {
        sendJson(response, 404, { error: "Document not found" });
        return;
      }

      sendJson(response, 200, { document });
      return;
    }

    if (request.url === "/add") {
      const document = {
        id: `doc-${String(documents.length + 1).padStart(3, "0")}`,
        title: body.title,
        content: body.content,
        nodePath: body.nodePath,
        tags: body.tags
      };

      documents.push(document);
      sendJson(response, 200, { document });
      return;
    }

    sendJson(response, 404, { error: "Unknown endpoint" });
  } catch (error) {
    sendJson(response, 400, {
      error: error instanceof Error ? error.message : "Bad request"
    });
  }
});

const port = Number(process.env.PORT || 3000);

server.listen(port, () => {
  console.log(`KB API running at http://localhost:${port}`);
});