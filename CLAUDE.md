# Ebanking — Claude Memory
> Last analyzed: 2026-09-10 (codebase-memory + manual enrichment for monorepo/Windows gaps)
> Re-analysis needed: NO — read the memory files below instead of source files

## What this project is
Internet-banking monorepo: Spring Boot backend (`backend/`, :8080) + React+TS frontend (`frontend/`, :5173). Users register with OTP mail, open savings accounts (admin-approved), deposit via Razorpay, transfer with confirmation, and use a consent-gated AI chat. Run guide: `HOW_TO_RUN.md`.

## Quick reference
- **Stack**: Java 17 + Spring Boot 3.5.7 (backend) · React 18 + TS + Vite + Tailwind + TanStack Query + Zustand (frontend) · MySQL + Redis
- **Dev**: backend `mvn spring-boot:run` (after sourcing `backend/.env`) · frontend `npm run dev`
- **Test**: backend `./mvnw test` · frontend: no tests (`npm run lint` only)
- **Build**: backend `./mvnw clean package` · frontend `npm run build` → `dist/`

## Memory files (read these, not source files)
- @.claude/rules/architecture.md — folder map, entry points, data flow
- @.claude/rules/stack.md — tech stack, versions, all commands
- @.claude/rules/modules.md — every module and what it does
- @.claude/rules/models.md — DB schemas and data types
- @.claude/rules/api.md — all routes and endpoints
- @.claude/rules/conventions.md — naming, patterns, testing approach
- @.claude/rules/gotchas.md — quirks, workarounds, do-not-touch
- @.claude/rules/changelog.md — what changed and when
- Per-service deep dives: `backend/CLAUDE.md` + `backend/.claude/rules/*`, `frontend/CLAUDE.md` + `frontend/.claude/rules/*`

## Instruction
You have full codebase knowledge from the files above.
Do NOT re-read source files to understand structure — use memory files.
If something seems outdated, flag it rather than re-analyzing.
