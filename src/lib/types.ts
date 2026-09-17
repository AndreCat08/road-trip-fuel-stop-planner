export type Unit = 'metric' | 'imperial';

export interface TripInput {
  distanceKm: number;
  tankL: number;
  consumptionL100: number;
  levelPct: number;
}

export interface Leg {
  distanceKm: number;
  refuelBefore: boolean;
}

export interface FuelPlan {
  distanceKm: number;
  fullRangeKm: number;
  currentRangeKm: number;
  legs: Leg[];
  stops: number;
  intervalKm: number;
  reachable: boolean;
}

export type FieldErrors = Partial<Record<keyof RawInput, string>>;

export interface RawInput {
  distance: string;
  tank: string;
  consumption: string;
  level: string;
}

