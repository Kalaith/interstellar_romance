# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

Interstellar Romance is a frontend-only React dating simulator game set in a sci-fi universe where players create characters and romance alien companions. The project uses modern React patterns with TypeScript and follows the WebHatchery game architecture standards.

## Common Development Commands

### Frontend Development
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server (runs on localhost:5173)
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Linting and formatting
npm run lint
npm run lint:fix
npm run format
npm run format:check

# Testing
npm run test
npm run test:run
npm run test:coverage
npm run test:ui

# Full CI pipeline (recommended before commits)
npm run ci

# Quick checks (lint, type-check, format)
npm run ci:quick

# Preview production build
npm run preview
```

### Deployment
```powershell
# Deploy to preview environment (H:\xampp\htdocs) - default
.\publish.ps1

# Deploy to production environment (F:\WebHatchery)
.\publish.ps1 -Production

# Deploy with clean build
.\publish.ps1 -Clean

# Deploy with verbose output
.\publish.ps1 -Verbose
```

## Project Architecture

### Technology Stack
- **React 19** with TypeScript for UI components
- **Vite 6** for build tooling and development server
- **Tailwind CSS 4** for styling
- **Zustand 5** for state management
- **Framer Motion** for animations
- **Chart.js** for data visualization
- **React Router DOM** for navigation
- **React Use** for utility hooks

### State Management Architecture
The game uses **Zustand** with a centralized store pattern:

- **Game Store** (`src/stores/gameStore.ts`): Core game state including current screen, player character, alien characters, and game progression
- **State Actions**: All mutations handled through store actions (createPlayer, selectCharacter, updateAffection, etc.)
- **Screen Management**: Game flow controlled via currentScreen state transitions

### Key Game Mechanics
- **Character Creation**: Players customize species, traits, stats, and backstory
- **Affection System**: Relationship building with 6 alien characters (0-100 affection scale)
- **Weekly Activities**: Activity selection system (maximum 2 activities per week)
- **Turn-based Progression**: Week-based advancement system

### Component Structure
```
src/components/
├── ActivitiesScreen.tsx     # Weekly activity selection interface
├── CharacterCreation.tsx    # Player character customization
├── CharacterInteraction.tsx # Dialogue and character interaction
├── MainHub.tsx             # Central game navigation hub
└── MainMenu.tsx            # Game entry point and menu
```

### Data Architecture
- **Static Game Data**: Character definitions and activities stored in `src/data/`
- **Type Definitions**: Comprehensive TypeScript types in `src/types/game.ts`
- **Character System**: 6 predefined alien characters with unique species, personalities, and progression

### Game Flow States
1. **main-menu**: Initial game screen
2. **character-creation**: Player character customization
3. **main-hub**: Central navigation and character selection
4. **character-interaction**: Dialogue and relationship building
5. **activities**: Weekly activity selection

## Build Configuration

### Vite Setup
- **Base Path**: Uses relative paths (`./`) for asset loading
- **Path Alias**: `@` mapped to `/src` for clean imports
- **Plugins**: React and Tailwind CSS integration
- **Development**: Auto-reloading on port 5173

### Environment Configuration
- **Preview**: Uses `.env.preview` for local testing deployment
- **Production**: Uses `.env.production` for production deployment
- **Base Path**: Automatically set based on deployment target

### Deployment Structure
```
<deployment_root>/interstellar_romance/
├── index.html              # Main entry point
├── assets/                 # Built frontend assets
└── [other static files]    # Vite build output
```

## Development Patterns

### State Management Patterns
- Use store actions for all state mutations
- Maintain immutable state updates
- Centralize game logic in store actions
- Keep components focused on presentation

### Component Patterns
- Functional components with hooks
- TypeScript prop interfaces for type safety
- Zustand store integration via useGameStore hook
- Responsive design with Tailwind CSS classes

### Game Development Considerations
- **Character Data**: Managed as static data with runtime state overlay
- **Save System**: No persistence implemented (session-based gameplay)
- **UI State**: Screen transitions managed through central store
- **Validation**: TypeScript provides compile-time type checking

## Testing and Quality

### Code Quality Tools
- **ESLint**: Code quality and consistency enforcement
- **TypeScript**: Compile-time type checking
- **Prettier**: Code formatting
- **CI Pipeline**: Automated checks via `npm run ci`

### Recommended Workflow
1. Run `npm run ci:quick` for fast development checks
2. Use `npm run ci` before commits for full validation
3. Test builds with `npm run preview` before deployment
4. Deploy to preview environment first, then production

## Important Notes

- **Frontend-only Architecture**: No backend dependencies
- **Static Character Data**: Characters defined in data files, not database
- **Session-based**: No save/load persistence between browser sessions
- **Responsive Design**: Tailwind CSS ensures mobile compatibility
- **TypeScript First**: All components and data structures fully typed