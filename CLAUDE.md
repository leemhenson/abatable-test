# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Carbon Portfolio system for tracking carbon credit positions. This is a technical test project with a React frontend and Express backend.

## Commands

```bash
# Install dependencies (run from root, then backend)
npm install
cd backend && npm install

# Start development (both frontend and backend)
npm run dev

# Or start separately
npm run dev:frontend    # Vite on http://localhost:8080
npm run dev:backend     # Express on http://localhost:4000

# Run tests
npm test               # Backend tests once
npm run test:watch     # Backend tests in watch mode

# Lint
npm run lint

# Build
npm run build
```

## Architecture

### Monorepo Structure
- `/src` - React frontend (Vite + TypeScript + Tailwind + shadcn/ui)
- `/backend` - Express API (TypeScript + Jest)

### Backend (`/backend/src`)
- `server.ts` - Express app with API routes
- `types.ts` - TypeScript definitions (Position, PortfolioSummary, PositionStatus)
- `services/portfolioSummary.ts` - Business logic for computing summaries
- `data/portfolio.ts` - Sample position data

### Frontend (`/src`)
- `pages/Index.tsx` - Main portfolio page
- `components/` - React components including PositionsTable
- `components/ui/` - shadcn/ui component library
- `types/portfolio.ts` - Mirrors backend types

### API Endpoints
- `GET /api/portfolio` - Returns all positions
- `GET /api/portfolio/summary` - Returns portfolio summary (has intentional 2-second delay)

## Key Implementation Details

- The `/api/portfolio/summary` endpoint has an **intentional 2-second delay** that must not be removed - it simulates a slow API for testing frontend loading states
- Frontend uses `@tanstack/react-query` (available but not yet used in Index.tsx)
- Backend tests use Jest with ts-jest
- The `computeSummary` function calculates weighted average price per tonne (weighted by tonnes, not simple average)
