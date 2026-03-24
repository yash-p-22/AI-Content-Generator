# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev          # Start dev server (Express + Vite HMR), loads .env automatically
npm run build        # Build client (Vite) + server (esbuild) → /dist/
npm start            # Run production build (NODE_ENV=production)
npm run check        # TypeScript type checking
```

## Environment

Requires `OPENAI_API_KEY` in `.env` (see `.env.example`). The server defaults to port 8080.

## Architecture

Full-stack monolith: Express server serves both the API and the React SPA.

- **`client/`** — React 18 SPA built with Vite. Uses Wouter for routing, React Query for server state, react-hook-form + Zod for forms, TailwindCSS + Radix UI for styling.
- **`server/`** — Express 5 backend. In dev, mounts Vite middleware for HMR. In prod, serves static files from `/dist/public`.
- **`shared/`** — Zod schemas (`schema.ts`) and typed API contract (`routes.ts`) shared between client and server.

### Data flow

1. User fills multi-step form on `/generator` page
2. `use-generate.ts` hook validates input, calls `POST /api/generate`
3. Server (`routes.ts`) sends prompt to OpenAI GPT-4o with JSON mode, returns structured content (hero, aboutUs, services, faq)
4. Result is saved to browser IndexedDB via Dexie (`lib/db.ts`) and displayed in `GeneratedOutput.tsx`
5. `/history` page reads all past generations from Dexie

### Key design decisions

- **No server-side database in use.** Drizzle ORM + PostgreSQL are configured but not wired into routes. All user data lives in client-side IndexedDB (Dexie).
- **Client-side rate limiting only** — 50 generations per 24 hours, enforced in `lib/db.ts`.
- **Single API endpoint:** `POST /api/generate` is the only route in `server/routes.ts`.
- **`server/replit_integrations/`** is legacy Replit-specific code, not used locally.

## TypeScript Path Aliases

- `@` → `client/src`
- `@shared` → `shared`
- `@assets` → `attached_assets`
