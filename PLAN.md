# Live Poll App — Implementation Plan

## Tech Stack (already in repo)

| Layer      | Choice                                                       |
| ---------- | ------------------------------------------------------------ |
| Framework  | **Next.js 16** (App Router) with **Bun**                     |
| Frontend   | React 19, Tailwind CSS v4, shadcn/ui, Atomic Design          |
| API        | Next.js API Routes (REST), OpenAPI spec via next-openapi-gen |
| Client SDK | **Orval** (generated fetch client) + **React Query**         |
| Database   | **PostgreSQL** via **Prisma**                                |
| Realtime   | **Server-Sent Events (SSE)** for live result updates         |
| Deployment | Vercel (or Docker)                                           |

### Why PostgreSQL + Prisma?

- Production-grade from day one — handles concurrent writes properly
- Prisma gives us type-safe queries, migrations, and a great DX
- Docker Compose for local Postgres keeps setup to one command

### Why SSE over WebSockets?

- Unidirectional (server→client) is all we need for live results
- Works over HTTP/1.1, no special infrastructure
- Native `EventSource` API in browsers, no client library needed

---

## Data Model (Prisma schema)

```prisma
model Poll {
  id        String   @id @default(nanoid(8))
  question  String
  createdAt DateTime @default(now())
  options   Option[]
  votes     Vote[]
}

model Option {
  id       Int    @id @default(autoincrement())
  pollId   String
  label    String
  position Int
  poll     Poll   @relation(fields: [pollId], references: [id])
  votes    Vote[]
}

model Vote {
  id         Int      @id @default(autoincrement())
  pollId     String
  optionId   Int
  voterToken String
  createdAt  DateTime @default(now())
  poll       Poll     @relation(fields: [pollId], references: [id])
  option     Option   @relation(fields: [optionId], references: [id])

  @@unique([pollId, voterToken]) // one vote per browser per poll
}
```

---

## API Endpoints

| Method | Path                         | Description                        |
| ------ | ---------------------------- | ---------------------------------- |
| POST   | `/api/polls`                 | Create a poll (question + options) |
| GET    | `/api/polls/[pollId]`        | Get poll details + current results |
| POST   | `/api/polls/[pollId]/vote`   | Cast a vote                        |
| GET    | `/api/polls/[pollId]/stream` | SSE stream for live results        |

---

## Phases

### Phase 1 — Database & API skeleton

**Goal:** Working REST API that can create polls, fetch them, and accept votes.

- [x] Install `prisma` + `@prisma/client` + `nanoid`
- [x] Add `docker-compose.yml` for local PostgreSQL
- [x] Create Prisma schema with Poll, Option, Vote models
- [x] Run `prisma migrate dev` to generate migration
- [x] Create repository: `src/repository/poll.repository.ts` (CRUD via Prisma)
- [x] Create business layer: `src/business/poll.business.ts`
- [x] Create API routes:
  - `src/app/api/polls/route.ts` — POST (create poll)
  - `src/app/api/polls/[pollId]/route.ts` — GET (poll + results)
  - `src/app/api/polls/[pollId]/vote/route.ts` — POST (cast vote)
- [x] Add Zod schemas for request/response validation

**Resume checkpoint:** API returns poll data at `GET /api/polls/[pollId]`

---

### Phase 2 — OpenAPI spec & generated client

**Goal:** Frontend has typed API client ready to use.

- [x] Add JSDoc annotations to route handlers for `next-openapi-gen`
- [x] Run `bun generate:api` to produce `openapi.json`
- [x] Run `bun generate:client` to produce typed Orval client
- [x] Verify generated client types match API

**Resume checkpoint:** `src/api/generated/server.client.ts` contains poll endpoints

---

### Phase 3 — Frontend: Create Poll page

**Goal:** User can create a poll with a question and 2–5 options.

- [x] Create page: `src/app/page.tsx` — "Create a Poll" form
- [x] Atom: `TextInput` (reuse shadcn Input)
- [x] Molecule: `OptionField` — input + remove button
- [x] Organism: `CreatePollForm` — question input, dynamic option list (2–5), submit
- [x] Use React Query mutation to POST `/api/polls`
- [x] On success → redirect to `/poll/[pollId]`
- [x] Basic input validation (non-empty question, at least 2 options)

**Resume checkpoint:** Creating a poll redirects to its shareable URL

---

### Phase 4 — Frontend: Vote & Results page

**Goal:** Users can vote and see results with visual bars.

- [x] Create page: `src/app/poll/[pollId]/page.tsx`
- [x] Organism: `VotingCard` — displays question + radio options + vote button
- [x] Organism: `ResultsChart` — horizontal progress bars with percentages
- [x] Molecule: `ProgressBar` — animated bar showing vote share
- [x] Molecule: `ShareLink` — copy-to-clipboard for the poll URL
- [x] Use React Query to GET poll data
- [x] Use React Query mutation for POST vote
- [x] After voting → show results view (store voted state in localStorage)
- [x] Show total vote count

**Resume checkpoint:** Full vote-then-see-results flow works end-to-end

---

### Phase 5 — Live updates via SSE

**Goal:** Results page updates in real-time when others vote.

- [x] Create API route: `src/app/api/polls/[id]/stream/route.ts` — SSE endpoint
- [x] Create event emitter: `src/event-emitter/poll.ts` — in-memory pub/sub for poll updates
- [x] Hook into vote route: emit event after successful vote
- [x] Frontend: `usePollEvents` hook that listens to `/api/polls/[id]/stream`
- [x] On SSE message → invalidate React Query cache (refetch results)
- [x] Graceful reconnect on disconnect (native EventSource auto-reconnect)

**Resume checkpoint:** Opening two browser tabs, voting in one updates the other live

---

### Phase 6 — Polish & README

**Goal:** Clean, presentable submission.

- [x] Update `layout.tsx` metadata (title, description)
- [x] Add visual polish: card containers, background, shadows, design tokens
- [x] Update `README.md` with:
  - Project overview
  - Setup instructions (`docker compose up -d && bun install && bun dev`)
  - Architecture overview
  - Trade-offs & what I'd add with more time

**Resume checkpoint:** Repo is submission-ready

---

## Trade-offs to discuss in interview

| Decision              | Why                                              | What I'd change with more time      |
| --------------------- | ------------------------------------------------ | ----------------------------------- |
| PostgreSQL + Prisma   | Type-safe, production-grade, handles concurrency | Add connection pooling (PgBouncer)  |
| Voter token (cookie)  | Simple duplicate prevention, no auth needed      | Rate limiting, IP-based dedup       |
| SSE over WebSockets   | Simpler, unidirectional is sufficient            | WebSockets if bidirectional needed  |
| No auth               | Explicitly not required                          | OAuth for poll ownership            |
| In-memory SSE emitter | Simple, works for single-instance                | Redis pub/sub for multi-instance    |
| nanoid for poll IDs   | Short, URL-friendly, collision-resistant         | UUID if database scale matters      |
| Docker for Postgres   | Reproducible local dev                           | Neon/Supabase for serverless deploy |
