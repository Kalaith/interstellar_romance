# Interstellar Romance Backend Implementation Guide

This backend makes the PHP API the authoritative source for Interstellar Romance content, state, and gameplay outcomes. The frontend should request game state and submit player intent; the backend validates the request, applies rules, persists the result, and returns the updated state.

## Backend Standards Checklist

- [x] PHP source files use `declare(strict_types=1)`.
- [x] `composer.json` is project-local and minimal.
- [x] Composer scripts include `start`, `test`, `cs-check`, and `cs-fix`.
- [x] Controllers are thin HTTP handlers.
- [x] Actions own request validation, orchestration, and persistence decisions.
- [x] Repositories own PDO SQL access and use prepared statements.
- [x] Services own reusable game logic.
- [x] Models are simple DTOs with `toArray()`.
- [x] Bearer auth uses shared WebHatchery JWT validation.
- [x] Unauthenticated API responses return `401` and `login_url`.
- [x] SQL schema and seed files live under `backend/database`.

## Content Migration Checklist

- [x] Companions, profiles, interests, values, personality growth, and starter photos are seeded.
- [x] Dialogue trees, dialogue responses, fallback responses, and dialogue rules are seeded.
- [x] Date plans, weekly activities, and self-improvement activities are seeded.
- [x] Milestones, photo galleries, relationship levels, knowledge unlock rules, moods, and achievements are seeded.
- [x] Storylines, storyline choices, and storyline rewards are seeded.
- [x] Super likes, icebreakers, conflict templates, resolution options, and personality growth triggers are seeded.
- [x] Player saves, relationship state, achievements, dates, memories, storylines, conflicts, boosts, and event log tables are ready.

## Runtime Flow

1. `GET /api/game` loads or creates the authenticated user's active save, then returns full server-calculated state.
2. `POST /api/game/start` validates and stores the player persona, resets the save, creates relationship rows for all seeded companions, and returns state.
3. `POST /api/dialogue/choose` validates the character, option requirements, and daily interaction allowance, then applies affection, milestones, knowledge, photos, relationship status, achievements, and memories.
4. `POST /api/date/complete` validates date availability, computes compatibility and success, applies rewards, records history, and returns state.
5. `POST /api/storyline/choice` validates unlocked storyline content and applies the selected consequence.
6. `POST /api/week/activities`, `POST /api/self-improvement`, `POST /api/super-like`, and `POST /api/conflict/resolve` mutate state through backend rules only.

## Database Setup

Run the schema first, then the seed data:

```sql
SOURCE backend/database/schema.sql;
SOURCE backend/database/seed_data.sql;
```

Regenerate `seed_data.sql` from the current frontend content after content edits:

```powershell
node backend/scripts/generate-seed-data.mjs
```

The generated seed uses idempotent upserts for content tables, so it can be reloaded after content changes without deleting player saves.

## Required Environment

Copy `backend/.env.example` to `backend/.env` and set database and shared auth values:

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET`
- `WEB_HATCHERY_LOGIN_URL`
- `CORS_ORIGIN`
- `APP_BASE_PATH` when deployed below a subdirectory

## API Cutover Notes

The existing frontend still contains local Zustand gameplay logic. During cutover, replace local mutations with API calls and treat returned `game_state` as the single source of truth. Client-side calculations may remain for display hints only, but cannot unlock content, apply affection, spend interactions, complete dates, or award achievements.
