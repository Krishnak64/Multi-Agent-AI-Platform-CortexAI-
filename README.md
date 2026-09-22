# 🤖 Multi-Agent AI Platform

A production-ready **Multi-Agent AI Platform** built on the **MERN stack** with a **microservices architecture**, powered by **LangGraph**, **LangChain**, and **RAG** over a **Qdrant** vector database.

A single prompt goes in, a router agent decides which specialised agent should handle it, and the answer streams back to the user.

---

## ✨ Features

- 🧠 **Multi-Agent System** — 8 specialised agents behind one router
- 🔀 **LangGraph Orchestration** — graph-based routing and state management
- 📚 **RAG Pipeline** — chat with your own PDFs using Qdrant
- ⚡ **Streaming Responses** — token-by-token output
- 🛠 **AI Tool Calling** — agents can call external tools
- 🏗 **Microservices** — independent, scalable services behind a gateway
- 🔐 **JWT Authentication** — secure auth flow
- 🚀 **Redis Caching** — faster responses, lower cost
- 📤 **File Upload & Document Processing**
- 🐳 **Dockerized** — one command to run everything
- 📦 **Scalable Folder Structure** and clean coding practices

---

## Video Demo 


https://github.com/user-attachments/assets/939a2b90-c30d-4366-ba6d-ca0f2e876765




## 🧩 Architecture

### Microservices

```
Frontend (React)
      │
      ▼
  Gateway  :8000
      │
      ├──► Auth Service     :8001
      ├──► Chat Service     :8002
      ├──► Agent Service    :8003
      └──► Billing Service  :8004

  Shared (common utils)

```


                                  OR

<img width="472" height="344" alt="Screenshot 2026-09-19 004448" src="https://github.com/user-attachments/assets/b834cb69-8af8-4f2a-acd5-8446340d796d" />



### Agent Graph (LangGraph)
                 

<img width="1208" height="864" alt="proj--1" src="https://github.com/user-attachments/assets/50ca99e7-e30c-4c6e-9d25-9c4a166c08b1" />



The **Search Agent** doesn't answer on its own — it fetches raw results and hands them to the **Chat Agent**, which turns them into a natural, cited answer. The router can also send a prompt straight to the Chat Agent when no search is needed.

```js
// agent/graph.js
graph.addConditionalEdges("router", routeDecision, {
  chat: "chatAgent",
  search: "searchAgent",
  coding: "codingAgent",
  pdf: "pdfAgent",
  pdfRag: "pdfRagAgent",
  image: "imageAgent",
  ppt: "pptAgent",
  vision: "visionAgent",
});

// search feeds its results into chat instead of ending
graph.addEdge("searchAgent", "chatAgent");

graph.addEdge("chatAgent", END);
graph.addEdge("codingAgent", END);
graph.addEdge("pdfAgent", END);
graph.addEdge("pdfRagAgent", END);
graph.addEdge("imageAgent", END);
graph.addEdge("pptAgent", END);
graph.addEdge("visionAgent", END);
```

| Agent | What it does |
|---|---|
| **Chat Agent** | Simple LLM conversation — also writes the final answer for search results |
| **Search Agent** | Fetches web results, then passes them to the Chat Agent |
| **Coding Agent** | Code generation, debugging, explanation |
| **PDF Agent** | Reads and summarises uploaded PDFs |
| **PDFRag Agent** | Q&A over PDFs using vector retrieval |
| **Image Analyser Agent** | Analyses uploaded images |
| **PPT Agent** | Generates presentations |
| **Vision Agent** | Visual understanding tasks |

### RAG Flow (PDF Agent → PDFRag Agent)

There are two separate paths: an **ingestion path** (runs once, when a document is uploaded) and a **query path** (runs on every user prompt).

```
INGESTION
─────────
Multiple PDFs ──► Chunking ──► Embedding model ──► Qdrant
 (PDF, PDF, PDF)   (split into                      (vector DB,
                    text chunks)                     stores chunk vectors)

QUERY
─────
User prompt ──► Embedding model ──► query vector
                                          │
                                          ▼
                          Qdrant similarity search
                          (top-k nearest chunks)
                                          │
                                          ▼
                          context  ┐
                          prompt   ┴──► Build final prompt
                                          │
                                          ▼
                                         LLM
                                          │
                                          ▼
                                    Response generated
                                          │
                                          ▼
                                    Sent back to user


```

                                                OR


<img width="527" height="311" alt="Screenshot 2026-09-19 003331" src="https://github.com/user-attachments/assets/e10391e5-c955-4394-bd96-d9c3e09cd235" />



**Step by step**

1. **Upload & chunk** — each PDF is parsed and split into overlapping text chunks (so the LLM never has to read a whole document at once).
2. **Embed the chunks** — every chunk is turned into a vector via the embedding model.
3. **Store in Qdrant** — chunk vectors are upserted into the vector database, indexed per document/collection.
4. **Embed the query** — when a user asks a question, their prompt is embedded with the *same* embedding model, so it lands in the same vector space as the chunks.
5. **Similarity search** — Qdrant returns the top-k most relevant chunks for that query vector.
6. **Build the final prompt** — the retrieved chunks (`context`) are combined with the user's original question (`prompt`) into one prompt template.
7. **Generate** — the LLM receives `context + prompt` and generates a grounded answer instead of relying on parametric memory alone.
8. **Respond** — the generated answer is streamed back to the user.

**Why this matters:** using the *same* embedding model for both ingestion and query keeps everything in one consistent vector space — a mismatch there is the most common cause of poor retrieval quality in RAG systems.

---

## 🛠 Tech Stack

**Frontend:** React.js, Redux Toolkit
**Backend:** Node.js, Express.js
**AI:** LangGraph, LangChain, RAG
**Database:** MongoDB, Qdrant (vectors), Redis (cache)
**DevOps:** Docker, AWS
**Auth:** JWT
**API:** REST

---

## 📁 Folder Structure

```
.
├── frontend/              # React + Redux Toolkit
├── backend/
│   ├── gateway/           # API gateway (8000)
│   ├── services/
│   │   ├── auth/          # Authentication (8001)
│   │   ├── chat/          # Conversations (8002)
│   │   ├── agent/         # LangGraph agents (8003)
│   │   └── billing/       # Billing (8004)
│   └── shared/            # Common utils, middleware, config
├── docker-compose.yml
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- MongoDB, Redis, Qdrant (or run them via Docker)
- An LLM API key

### 1. Clone the repo

```bash
git clone https://github.com/your-username/multi-agent-ai-platform.git
cd multi-agent-ai-platform
```

### 2. Add environment variables

Create a `.env` file in the backend root:

```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/ai-platform
REDIS_URL=redis://localhost:6379
QDRANT_URL=http://localhost:6333
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_api_key
```

### 3. Run with Docker (recommended)

```bash
docker-compose up --build
```

### 4. Or run manually

```bash
# backend - run each service
cd backend/gateway && npm install && npm run dev
cd backend/services/auth && npm install && npm run dev
cd backend/services/chat && npm install && npm run dev
cd backend/services/agent && npm install && npm run dev

# frontend
cd frontend && npm install && npm run dev
```

Frontend: `http://localhost:5173`
Gateway: `http://localhost:8000`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/chat/conversations` | List conversations |
| POST | `/api/chat/message` | Send a message (streaming) |
| POST | `/api/agent/run` | Run the agent graph |
| POST | `/api/agent/upload` | Upload a document for RAG |
| GET | `/api/billing/usage` | Usage and credits |

> All protected routes require: `Authorization: Bearer <token>`

---

## 🗺 Roadmap

- [ ] Add more agents (SQL, email, calendar)
- [ ] Usage analytics dashboard
- [ ] Kubernetes deployment

---

## 🤝 Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.

---
