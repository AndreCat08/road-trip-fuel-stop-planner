# Road Trip Fuel Stop Planner

Single-page calculator for road trip fuel stops, driving range, and intervals with live unit conversion (Metric/Imperial).

## Quick Start

```bash
npm install
npm run dev
```

## Commands

- `npm run dev` — start dev server
- `npm test` — run tests (Vitest)
- `npm run typecheck` — TypeScript check
- `npm run build` — production build
- `npm run preview` — preview build

## Architecture

- Vanilla TypeScript + Vite + Vitest (zero UI framework runtime).
- Pure calculation domain in `src/lib/` (unit-agnostic SI canonical core).
- Accessible with loading, empty, and validation error states.
