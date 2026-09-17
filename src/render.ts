import type { AppState } from './state';
import { evaluateState } from './state';
import type { FuelPlan } from './lib/types';
import { toDisplay, unitLabel } from './lib/units';

export interface DomElements {
  unitButtons: HTMLButtonElement[];
  inputs: Record<string, HTMLInputElement>;
  levelBadge: HTMLElement;
  unitLabels: HTMLElement[];
  errorBanner: HTMLElement;
  emptyState: HTMLElement;
  resultsView: HTMLElement;
  stats: Record<string, HTMLElement>;
  progressTrack: HTMLElement;
  loadingState: HTMLElement | null;
}

const el = <T extends HTMLElement>(sel: string): T => {
  const found = document.querySelector<T>(sel);
  if (!found) throw new Error(`Missing ${sel}`);
  return found;
};

export function bindDom(): DomElements {
  return {
    unitButtons: Array.from(document.querySelectorAll<HTMLButtonElement>('.unit-btn')),
    inputs: {
      distance: el('#inputDistance'),
      tank: el('#inputTank'),
      consumption: el('#inputConsumption'),
      level: el('#inputLevel'),
      levelRange: el('#inputLevelRange'),
    },
    levelBadge: el('#levelBadge'),
    unitLabels: Array.from(document.querySelectorAll<HTMLElement>('[data-unit-kind]')),
    errorBanner: el('#errorBanner'),
    emptyState: el('#emptyState'),
    resultsView: el('#resultsView'),
    stats: {
      currentRange: el('#statCurrentRange'),
      stops: el('#statStops'),
      interval: el('#statInterval'),
      rangeUnit: el('#statCurrentRangeUnit'),
      intervalUnit: el('#statIntervalUnit'),
    },
    progressTrack: el('#progressTrack'),
    loadingState: document.querySelector('#loadingState'),
  };
}

export function render(dom: DomElements, state: AppState): void {
  dom.loadingState?.remove();
  dom.loadingState = null;

  for (const btn of dom.unitButtons) btn.setAttribute('aria-pressed', String(btn.dataset.unit === state.unit));
  for (const node of dom.unitLabels) {
    const kind = node.dataset.unitKind as 'distance' | 'tank' | 'consumption';
    if (kind) node.textContent = unitLabel(kind, state.unit);
  }

  const km = unitLabel('distance', state.unit);
  dom.stats.rangeUnit.textContent = km;
  dom.stats.intervalUnit.textContent = km;

  const res = evaluateState(state);
  const messages = Object.values(res.errors).filter(Boolean);
  dom.errorBanner.hidden = messages.length === 0;
  dom.errorBanner.textContent = messages.join(' ');

  for (const [key, input] of Object.entries(dom.inputs)) {
    input.setAttribute('aria-invalid', String(Boolean(res.errors[key as keyof typeof res.errors])));
  }
  dom.levelBadge.textContent = `${state.raw.level}%`;

  const ready = !res.empty && !res.hasErrors && res.plan !== null;
  dom.emptyState.hidden = ready;
  dom.resultsView.hidden = !ready;
  if (!ready || !res.plan) return;

  const plan = res.plan;
  dom.stats.currentRange.textContent = String(Math.round(toDisplay(plan.currentRangeKm, 'distance', state.unit)));
  dom.stats.stops.textContent = plan.reachable ? String(plan.stops) : '!';
  dom.stats.interval.textContent = String(Math.round(toDisplay(plan.intervalKm, 'distance', state.unit)));

  renderProgress(dom.progressTrack, plan, state.unit);
}

function renderProgress(track: HTMLElement, plan: FuelPlan, unit: AppState['unit']): void {
  const label = unitLabel('distance', unit);
  const total = plan.legs.reduce((sum, leg) => sum + leg.distanceKm, 0) || 1;
  track.innerHTML = plan.legs
    .map((leg, i) => {
      const width = Math.max((leg.distanceKm / total) * 100, 8).toFixed(2);
      const dist = Math.round(toDisplay(leg.distanceKm, 'distance', unit));
      const kind = i === 0 ? 'first' : leg.refuelBefore ? 'refuel' : '';
      return `<div class="leg-bar" data-kind="${kind}" style="flex-basis:${width}%" title="Leg ${i + 1}: ${dist} ${label}">${dist} ${label}</div>`;
    })
    .join('');
}

