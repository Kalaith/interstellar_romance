# Interstellar Romance

Interstellar Romance is a Stellaris-inspired browser dating simulator built with React, TypeScript, Vite, Tailwind CSS, and Zustand.

Players create an interstellar persona, meet alien companions, build affection through conversations and activities, unlock relationship details over time, plan dates, collect photos, and track relationship milestones.

## Current Features

- Custom player creation with species, gender, romantic preference, traits, backstory, and starting stats.
- Eight romanceable companions:
  - Kyra'then, Aviari sky warrior
  - Seraphina Voidwhisper, Mystari dimensional sage
  - Dr. Thessarian Brightleaf, Sylvani biotechnician
  - Lyralynn Bloomheart, Florani garden keeper
  - Commander Zarantha Scales, Draconi elite guard
  - High Priest Thalassos, Aquari deep sage
  - Nightshade Voidwalker, Umbra shadow operative
  - Dr. Kronos Mindweave, Cephalopi neural engineer
- Preference-based companion filtering by gender or open species preference.
- Character profiles with progressive information disclosure for species, personality, interests, values, background, goals, dealbreakers, and favorite topics.
- Compatibility scoring based on player stats, interests, values, conversation style, and preferred activities.
- Enhanced character interaction screen with dialogue choices, affection changes, daily interaction limits, and relationship status.
- Weekly activities and daily self-improvement options that support player progression.
- Date planning with multiple date plans, required affection levels, compatibility bonuses, date history, and affection rewards.
- Photo galleries with affection-gated unlocks.
- Relationship timeline and milestones.
- Achievement tracking across relationship, dating, conversation, collection, mastery, and exploration goals.
- Local game state management with reset support.
- Stellaris-style space UI theme and bundled character images.

## Project Layout

```text
.
├── .github/                 # GitHub workflow configuration
├── frontend/                # React/Vite game client
│   ├── public/              # Static assets and character images
│   ├── src/
│   │   ├── api/             # Shared API client helpers
│   │   ├── components/      # Screens and reusable UI components
│   │   ├── constants/       # Game tuning constants
│   │   ├── data/            # Characters, dialogue, dates, achievements, activities
│   │   ├── hooks/           # Game-specific React hooks
│   │   ├── pages/           # Page shell
│   │   ├── services/        # Logging/service helpers
│   │   ├── stores/          # Zustand stores
│   │   ├── styles/          # Global theme styles
│   │   ├── types/           # TypeScript game types
│   │   └── utils/           # Compatibility, assets, validation, timezone utilities
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── publish.ps1              # WebHatchery publish wrapper
├── README.md
└── STYLE_GUIDE.md           # Current UI style guide and migration checklist
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Install and Run

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server will print the local URL, typically `http://localhost:5173`.

## Scripts

Run these from `frontend/`.

```bash
npm run dev           # Start the local Vite dev server
npm run build         # Type-check and build production assets
npm run preview       # Preview the production build
npm run lint          # Run ESLint
npm run type-check    # Run TypeScript without emitting files
npm run format:check  # Check Prettier formatting
npm run test:run      # Run Vitest tests once
npm run ci            # Run lint, type-check, format, tests, and build
```

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- Vitest
- ESLint and Prettier
- Axios helper client for WebHatchery-style API/auth integration

## UI Style Guide

UI direction, Tailwind conventions, theme tokens, and the current UI migration checklist are maintained in `STYLE_GUIDE.md`.

## Roadmap

### Near Term

- Expand smoke tests into component tests for character creation, main hub filtering, dialogue interactions, and date planning.
- Add regression tests around affection thresholds, daily interaction reset behavior, and photo unlocks.
- Review unused dependencies and remove packages that are not part of the active app surface.
- Improve README screenshots or add a short gameplay capture once the UI stabilizes.

### Gameplay

- Add more dialogue branches per companion and make choices produce clearer long-term consequences.
- Finish wiring advanced systems such as conflicts, super likes, temporary boosts, and icebreakers into the main gameplay loop.
- Add more companion-specific story events and unlockable scenes.
- Balance affection gains, date requirements, achievement progress, and daily activity pacing.

### UX and Polish

- Replace placeholder/settings-only toggles with working audio, animation, and accessibility settings.
- Add save/export/import controls for local game data.
- Improve mobile layouts for dense screens like profiles, achievements, and galleries.
- Add loading and empty states for all major screens.
- Audit copy consistency across character names, species labels, and relationship status text.

### Technical

- Consolidate overlapping stores where practical, or document store ownership boundaries.
- Add stricter validation around persisted local state migrations.
- Add visual regression coverage for the main screens.
- Improve asset handling so missing or invalid images are easier to detect in CI.
- Consider adding a small backend integration only if shared accounts, cloud saves, or cross-device progress become required.

## Publishing

The root `publish.ps1` delegates to the shared WebHatchery publish script:

```powershell
.\publish.ps1
```

## License

No standalone license file is currently included in this repository.

Part of the WebHatchery game collection.
