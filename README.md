# Live Poll

A real-time polling app where users can create polls, vote, and see results update live across browser tabs.

## Setup

```bash
# Start PostgreSQL
docker compose up -d

# Install dependencies & set up database
cd app
bun install
bun bootstrap:db

# Start dev server
bun dev
```

The app runs at `http://localhost:3000`.

## Tech Stack

| Layer     | Choice                                                    |
| --------- | --------------------------------------------------------- |
| Framework | Next.js 16 (App Router), Bun                              |
| Frontend  | React 19, Tailwind CSS v4, shadcn/ui, TanStack React Form |
| API       | REST via Next.js API Routes, OpenAPI spec + Orval client  |
| Database  | PostgreSQL via Prisma                                     |
| Realtime  | Server-Sent Events (SSE)                                  |

## Architecture

```
src/
├── app/api/          # API routes (controller layer)
├── business/         # Business logic
├── repositories/     # Data access via Prisma
├── entities/         # Pure data transformations
├── event-emitter/    # In-memory pub/sub for SSE
├── schemas/          # Shared Zod schemas (single source of truth)
├── generated/        # Orval-generated typed API client
├── storage/          # Type-safe localStorage wrapper
├── hooks/            # Custom React hooks (SSE events)
├── components/
│   ├── atoms/        # Button, Text, Icon, LoadingSpinner
│   ├── molecules/    # OptionField, ProgressBar, ShareLink
│   ├── organisms/    # CreatePollForm, VotingCard, ResultsChart
│   └── shadcn-ui/    # Base UI primitives
└── app/
    ├── page.tsx      # Create poll page
    └── poll/[id]/    # Vote & results page
```

Information flows inward: **Routes → Business → Repository → Entities**. No layer communicates upward.

## How It Works

1. **Create a poll** — submit a question with 2–5 options
2. **Share the URL** — anyone with the link can vote
3. **Vote** — select an option, one vote per browser (token-based)
4. **Live results** — progress bars update in real-time via SSE when others vote

## API Endpoints

| Method | Path                     | Description           |
| ------ | ------------------------ | --------------------- |
| POST   | `/api/polls`             | Create a poll         |
| GET    | `/api/polls/[id]`        | Get poll with results |
| POST   | `/api/polls/[id]/vote`   | Cast a vote           |
| GET    | `/api/polls/[id]/stream` | SSE for live updates  |

API docs available at `/docs` (Scalar UI).

## Trade-offs

| Decision            | Why                                         | With more time                     |
| ------------------- | ------------------------------------------- | ---------------------------------- |
| Voter token         | Simple dedup, no auth needed                | Rate limiting, IP-based dedup      |
| SSE over WebSockets | Unidirectional is sufficient, simpler infra | WebSockets if bidirectional needed |
| In-memory emitter   | Simple, works for single instance           | Redis pub/sub for multi-instance   |
| nanoid for poll IDs | Short, URL-friendly, collision-resistant    | UUID at scale                      |
