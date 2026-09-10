import type { Action, AppState } from './types';

export const initialState: AppState = {
  screen: 'setup',
  draft: null,
  trip: null,
  i: 0,
  res: {},
  force: [],
  history: [],
};

const fresh: Pick<AppState, 'trip' | 'i' | 'res' | 'force'> = { trip: null, i: 0, res: {}, force: [] };

export function reducer(s: AppState, a: Action): AppState {
  switch (a.type) {
    case 'hydrate':
      return a.state;
    case 'draft':
      return { ...s, draft: { name: '', season: 'mid', nights: 'one', ...s.draft, ...a.draft } };
    case 'start':
      return { ...s, ...fresh, trip: a.trip, screen: 'deck' };
    case 'answer':
      return { ...s, res: { ...s.res, [a.id]: a.result } };
    case 'advance':
      return { ...s, i: s.i + 1 };
    case 'undo': {
      const res = { ...s.res };
      delete res[a.id];
      return { ...s, i: Math.max(0, s.i - 1), res };
    }
    case 'goto': {
      const res = { ...s.res };
      delete res[a.id];
      const force = a.force && !s.force.includes(a.force) ? [...s.force, a.force] : s.force;
      return { ...s, i: a.index, res, force, screen: 'deck' };
    }
    case 'poster':
      return { ...s, screen: 'poster' };
    case 'finish':
      return {
        ...s,
        ...fresh,
        history: [a.record, ...s.history].slice(0, 10),
        draft: a.nextDraft,
        screen: 'setup',
      };
    case 'discard':
      return { ...s, ...fresh, screen: 'setup' };
    default:
      return s;
  }
}
