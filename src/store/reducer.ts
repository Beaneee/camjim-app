import type { Action, AppState } from './types';

export const initialState: AppState = {
  screen: 'setup',
  draft: null,
  trip: null,
  round: 'main',
  i: 0,
  queue: [],
  j: 0,
  res: {},
  force: [],
  history: [],
};

const fresh: Pick<AppState, 'trip' | 'round' | 'i' | 'queue' | 'j' | 'res' | 'force'> = {
  trip: null, round: 'main', i: 0, queue: [], j: 0, res: {}, force: [],
};

export function reducer(s: AppState, a: Action): AppState {
  switch (a.type) {
    case 'hydrate':
      return a.state;

    case 'draft':
      return { ...s, draft: { name: '', season: 'mid', nights: 'one', force: [], ...s.draft, ...a.draft } };

    case 'toggleDraftForce': {
      const d = s.draft ?? { name: '', season: 'mid' as const, nights: 'one' as const, force: [] };
      const force = d.force.includes(a.id) ? d.force.filter((x) => x !== a.id) : [...d.force, a.id];
      return { ...s, draft: { ...d, force } };
    }

    case 'start':
      return { ...s, ...fresh, trip: a.trip, force: a.force, screen: 'deck' };

    case 'answer': {
      const res = { ...s.res, [a.id]: a.result };
      if (s.round === 'main') {
        const i = s.i + 1;
        if (i < a.deckIds.length) return { ...s, res, i };
        // 본 회차 끝: '나중에'로 넘긴 짐이 있으면 다시 묻는다
        const queue = a.deckIds.filter((id) => res[id] === 'later');
        return queue.length
          ? { ...s, res, i, round: 'later', queue, j: 0 }
          : { ...s, res, i, round: 'done' };
      }
      if (s.round === 'later') {
        const j = s.j + 1;
        return j < s.queue.length ? { ...s, res, j } : { ...s, res, j, round: 'done' };
      }
      return s;
    }

    case 'undo': {
      if (s.round === 'later' && s.j > 0) {
        const id = s.queue[s.j - 1];
        return { ...s, j: s.j - 1, res: { ...s.res, [id]: 'later' } };
      }
      // '나중에' 회차 첫 장이나 본 회차: 본 회차의 직전 카드로
      if (s.round !== 'main' || s.i > 0) {
        const i = Math.min(s.i, a.deckIds.length) - 1;
        if (i < 0) return s;
        const res = { ...s.res };
        delete res[a.deckIds[i]];
        return { ...s, round: 'main', queue: [], j: 0, i, res };
      }
      return s;
    }

    case 'poster':
      return { ...s, screen: 'poster' };

    // 그만하기: 시작 화면으로 가되 진행은 남겨 둔다 (이어서 하기)
    case 'pause':
      return s.trip ? { ...s, screen: 'setup' } : s;

    case 'resume':
      return s.trip ? { ...s, screen: s.round === 'done' ? 'poster' : 'deck' } : s;

    case 'resolve':
      return { ...s, res: { ...s.res, [a.id]: a.result } };

    case 'include':
      return {
        ...s,
        force: s.force.includes(a.id) ? s.force : [...s.force, a.id],
        res: { ...s.res, [a.id]: 'yes' },
      };

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
