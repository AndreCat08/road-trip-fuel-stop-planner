import type { Unit, RawInput } from './lib/types';
import { parseTrip } from './lib/validate';
import { calculatePlan } from './lib/fuel';
import { fromDisplay, toDisplay } from './lib/units';

export interface AppState {
  unit: Unit;
  raw: RawInput;
}

export const defaultState: AppState = {
  unit: 'metric',
  raw: {
    distance: '850',
    tank: '50',
    consumption: '7.5',
    level: '60',
  },
};

export function evaluateState(state: AppState) {
  const parsed = parseTrip(state.raw, state.unit);
  const plan = parsed.empty ? null : calculatePlan(parsed.input);
  return {
    empty: parsed.empty,
    errors: parsed.errors,
    hasErrors: Object.keys(parsed.errors).length > 0,
    plan,
    input: parsed.input,
  };
}

export function convertInputUnit(raw: RawInput, from: Unit, to: Unit): RawInput {
  if (from === to) return { ...raw };
  const d = Number(raw.distance);
  const t = Number(raw.tank);
  const c = Number(raw.consumption);

  return {
    distance: Number.isFinite(d) && d >= 0 ? round(toDisplay(fromDisplay(d, 'distance', from), 'distance', to)) : raw.distance,
    tank: Number.isFinite(t) && t > 0 ? round(toDisplay(fromDisplay(t, 'tank', from), 'tank', to)) : raw.tank,
    consumption: Number.isFinite(c) && c > 0 ? round(toDisplay(fromDisplay(c, 'consumption', from), 'consumption', to)) : raw.consumption,
    level: raw.level,
  };
}

function round(v: number): string {
  return String(Number(v.toFixed(2)));
}
