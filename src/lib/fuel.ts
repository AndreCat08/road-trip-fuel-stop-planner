import type { TripInput, FuelPlan, Leg } from './types';

const EPS = 1e-9;

export function calculatePlan(input: TripInput): FuelPlan {
  const fullRangeKm =
    input.consumptionL100 > EPS ? (input.tankL * 100) / input.consumptionL100 : Infinity;
  const frac = input.levelPct / 100;
  const currentRangeKm = frac <= EPS ? 0 : fullRangeKm * frac;

  const legs: Leg[] = [];
  let remaining = input.distanceKm;
  if (currentRangeKm > EPS && remaining > EPS) {
    const distanceKm = Math.min(currentRangeKm, remaining);
    legs.push({ distanceKm, refuelBefore: false });
    remaining -= distanceKm;
  }
  while (remaining > EPS && fullRangeKm > EPS) {
    const distanceKm = Math.min(fullRangeKm, remaining);
    legs.push({ distanceKm, refuelBefore: true });
    remaining -= distanceKm;
  }

  const stops = legs.reduce((n, l) => n + Number(l.refuelBefore), 0);
  return {
    distanceKm: input.distanceKm,
    fullRangeKm,
    currentRangeKm,
    legs,
    stops,
    intervalKm: fullRangeKm,
    reachable: remaining <= EPS,
  };
}
