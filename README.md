# Road Trip Fuel Stop Planner

A responsive single-page calculator that estimates driving range, required fuel stops, and suggested stop intervals for a road trip.

## Features

- Live calculations as trip or vehicle inputs change
- Metric units: kilometers, liters, and L/100km
- Imperial units: miles, gallons, and MPG
- Automatic value conversion when switching unit systems
- Current-fuel range, required stop count, and full-tank stop interval
- Segmented trip-leg visualization
- Input validation with accessible error, loading, and empty states
- Keyboard focus styles and reduced-motion support
- Responsive mobile and desktop layout

## Quick Start

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm test` | Run the Vitest suite once |
| `npm run typecheck` | Check TypeScript types |
| `npm run build` | Type-check and create a production build |
| `npm run preview` | Preview the production build locally |

## How It Works

The calculator converts displayed values into canonical metric values before calculating:

```text
full-tank range = tank liters × 100 ÷ L/100km
current range   = full-tank range × current fuel percentage
```

The trip is split into one initial leg using current fuel, followed by full-tank legs. A vehicle starting at 0% fuel counts a fuel stop before departure.

## Project Structure

```text
src/
  lib/
    fuel.ts       Pure fuel-stop calculations
    units.ts      Metric and imperial conversions
    validate.ts   Input parsing and validation
    types.ts      Shared TypeScript types
  main.ts         Event binding and application bootstrap
  render.ts       Accessible DOM rendering
  state.ts        Application state and unit switching
  style.css       Design tokens and responsive styles
tests/
  app.test.ts     Calculation, validation, conversion, and state tests
```

## Technical Notes

- Vanilla TypeScript with native ES modules
- Vite for development and production builds
- Vitest for unit tests
- No runtime framework or persistence
- User-provided values are numeric inputs; generated UI content contains only validated numeric data and fixed labels
- Raw non-Markdown source remains below the challenge's 25KB limit
