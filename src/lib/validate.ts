import type { RawInput, TripInput, FieldErrors, Unit } from './types';
import { fromDisplay } from './units';

const toN = (s: string): number | null => {
  const t = s.trim();
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
};

export function parseTrip(raw: RawInput, unit: Unit): { empty: boolean; input: TripInput; errors: FieldErrors } {
  const d = toN(raw.distance);
  if (d === null) return { empty: true, input: { distanceKm: 0, tankL: 0, consumptionL100: 0, levelPct: 0 }, errors: {} };

  const errors: FieldErrors = {};
  if (d < 0) errors.distance = 'Distance must be 0 or more.';
  const t = toN(raw.tank);
  if (t === null || t <= 0) errors.tank = 'Tank size must be greater than 0.';
  const c = toN(raw.consumption);
  if (c === null || c <= 0) errors.consumption = 'Fuel efficiency must be greater than 0.';
  const l = toN(raw.level);
  if (l === null || l < 0 || l > 100) errors.level = 'Fuel level must be between 0 and 100%.';

  return {
    empty: false,
    input: {
      distanceKm: d >= 0 ? fromDisplay(d, 'distance', unit) : 0,
      tankL: t && t > 0 ? fromDisplay(t, 'tank', unit) : 0,
      consumptionL100: c && c > 0 ? fromDisplay(c, 'consumption', unit) : 0,
      levelPct: l !== null && l >= 0 && l <= 100 ? l : 0,
    },
    errors,
  };
}
