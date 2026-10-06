import type { Nights, Season, Trip } from '../data/items';

export type Screen = 'setup' | 'deck' | 'poster';

/** 챙겼다 / 나중에 / 필요 없어 */
export type Result = 'yes' | 'later' | 'no';

/** 본 회차 → '나중에' 다시 묻기 → 끝 */
export type Round = 'main' | 'later' | 'done';

export type TripRecord = {
  name: string;
  season: Season;
  nights: Nights;
  date: string;
  yes: string[];
  later: string[]; // 끝까지 '나중에'로 남은 짐
  no: string[];
  auto: string[];
};

export type Draft = { name: string; season: Season; nights: Nights; force: string[] };

export type AppState = {
  screen: Screen;
  draft: Draft | null;
  trip: Trip | null;
  round: Round;
  i: number;                       // 본 회차 카드 위치
  queue: string[];                 // '나중에' 회차에서 다시 물을 짐
  j: number;                       // '나중에' 회차 위치
  res: Record<string, Result>;     // 짐별 답
  force: string[];                 // 자동으로 뺐다가 다시 넣은 짐
  history: TripRecord[];           // 지난 캠핑 (최신순)
};

export type Action =
  | { type: 'hydrate'; state: AppState }
  | { type: 'draft'; draft: Partial<Draft> }
  | { type: 'toggleDraftForce'; id: string }
  | { type: 'start'; trip: Trip; force: string[] }
  | { type: 'answer'; id: string; result: Result; deckIds: string[] }
  | { type: 'undo'; deckIds: string[] }
  | { type: 'poster' }
  | { type: 'resolve'; id: string; result: Result }
  | { type: 'include'; id: string }
  | { type: 'finish'; record: TripRecord; nextDraft: Draft }
  | { type: 'discard' };
