# CloudSearch Frontend

Next.js (App Router) UI for searching indexed cloud architecture documentation across AWS, Azure, and GCP.

Sibling repos: **Backend** (search API), **Ingestion** (corpus), **Database** (schema).

## What’s in this repo

| Path | Purpose |
| --- | --- |
| `app/` | App Router pages and global styles |
| `components/` | `SearchForm`, `SearchResults`, `ResultItem`, `ProviderBadge`, `SearchPage` |
| `lib/api.ts` | Typed clients for `/v1/search` and `/healthz` |
| `types/search.ts` | Shared TypeScript API types |
| `Dockerfile` | Multi-stage standalone Next.js image |
| `.env.example` | `NEXT_PUBLIC_API_URL` template |

## Prerequisites

- Node.js **20+**
- Backend API reachable (default `http://localhost:8080`) with documents ingested

## How to start (standalone)

```bash
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8080

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How to start (Docker)

```bash
docker build -t cloudsearch-frontend \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost:8080 \
  .

docker run --rm -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:8080 \
  cloudsearch-frontend
```

`NEXT_PUBLIC_*` values are inlined at **build** time — pass the correct `--build-arg` for your API host.

## How to start (full local stack)

From the parent `Cloud_Search_Engine` folder:

```bash
docker compose up --build -d
# Frontend: http://localhost:3000  API: http://localhost:8080
```

## Production build

```bash
npm run build
npm start
```

Uses Next.js `output: "standalone"` for container deploys.

## API contract used by the UI

| Endpoint | Description |
| --- | --- |
| `GET /v1/search?q=&provider=&service=&limit=` | Ranked documentation search |
| `GET /healthz` | Health pill in the header |
