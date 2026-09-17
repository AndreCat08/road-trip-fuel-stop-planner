import type { Unit } from './types';

export const KM_PER_MILE = 1.609344;
export const L_PER_GALLON = 3.785411784;
export const L100_PER_MPG = (100 * L_PER_GALLON) / KM_PER_MILE;

export const milesToKm = (m: number): number => m * KM_PER_MILE;
export const kmToMiles = (km: number): number => km / KM_PER_MILE;
export const gallonsToLiters = (g: number): number => g * L_PER_GALLON;
export const litersToGallons = (l: number): number => l / L_PER_GALLON;
export const mpgToL100 = (mpg: number): number => L100_PER_MPG / mpg;
export const l100ToMpg = (l100: number): number => L100_PER_MPG / l100;

export type Kind = 'distance' | 'tank' | 'consumption';

export function fromDisplay(v: number, kind: Kind, unit: Unit): number {
  if (unit === 'metric') return v;
  return kind === 'distance' ? milesToKm(v) : kind === 'tank' ? gallonsToLiters(v) : mpgToL100(v);
}

export function toDisplay(si: number, kind: Kind, unit: Unit): number {
  if (unit === 'metric') return si;
  return kind === 'distance' ? kmToMiles(si) : kind === 'tank' ? litersToGallons(si) : l100ToMpg(si);
}

export function unitLabel(kind: Kind, unit: Unit): string {
  if (kind === 'distance') return unit === 'metric' ? 'km' : 'mi';
  if (kind === 'tank') return unit === 'metric' ? 'L' : 'gal';
  return unit === 'metric' ? 'L/100km' : 'MPG';
}
