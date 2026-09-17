import './style.css';
import { defaultState, convertInputUnit } from './state';
import type { AppState } from './state';
import type { Unit } from './lib/types';
import { bindDom, render } from './render';

const state: AppState = { ...defaultState };

window.addEventListener('DOMContentLoaded', () => {
  const dom = bindDom();

  const syncInputs = () => {
    dom.inputs.distance.value = state.raw.distance;
    dom.inputs.tank.value = state.raw.tank;
    dom.inputs.consumption.value = state.raw.consumption;
    dom.inputs.level.value = state.raw.level;
    dom.inputs.levelRange.value = state.raw.level;
  };

  syncInputs();
  render(dom, state);

  const onField = (key: keyof AppState['raw'], val: string) => {
    state.raw[key] = val;
    if (key === 'level') {
      dom.inputs.level.value = val;
      dom.inputs.levelRange.value = val;
    }
    render(dom, state);
  };

  dom.inputs.distance.addEventListener('input', (e) => onField('distance', (e.target as HTMLInputElement).value));
  dom.inputs.tank.addEventListener('input', (e) => onField('tank', (e.target as HTMLInputElement).value));
  dom.inputs.consumption.addEventListener('input', (e) => onField('consumption', (e.target as HTMLInputElement).value));
  dom.inputs.level.addEventListener('input', (e) => onField('level', (e.target as HTMLInputElement).value));
  dom.inputs.levelRange.addEventListener('input', (e) => onField('level', (e.target as HTMLInputElement).value));

  for (const btn of dom.unitButtons) {
    btn.addEventListener('click', () => {
      const next = btn.dataset.unit as Unit;
      if (!next || next === state.unit) return;
      state.raw = convertInputUnit(state.raw, state.unit, next);
      state.unit = next;
      syncInputs();
      render(dom, state);
    });
  }

  document.querySelector<HTMLButtonElement>('#btnEmptyCta')?.addEventListener('click', () => {
    dom.inputs.distance.focus();
  });
});
