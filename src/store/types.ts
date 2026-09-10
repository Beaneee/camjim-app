import type { Season, Nights, Trip } from '../data/items';

export type Screen = 'setup' | 'deck' | 'poster';
export type Result = 'yes' | 'pass';

export type TripRecord = {
  name: string;
  season: Season;
  nights: Nights;
  date: string;
  yes: string[];
  pass: string[];
  auto: string[];
};

export type Draft = { name: string; season: Season; nights: Nights };

export type AppState = {
  screen: Screen;
  draft: Draft | null;
  trip: Trip | null;
  i: number;                       // 현재 카드 인덱스
  res: Record<string, Result>;     // 항목별 결과
  force: string[];                 // 자동 패스를 무시하고 다시 넣은 항목
  history: TripRecord[];           // 지난 캠핑 (최신순)
};

export type Action =
  | { type: 'hydrate'; state: AppState }
  | { type: 'draft'; draft: Partial<Draft> }
  | { type: 'start'; trip: Trip }
  | { type: 'answer'; id: string; result: Result }
  | { type: 'advance' }
  | { type: 'undo'; id: string }
  | { type: 'goto'; index: number; id: string; force?: string }
  | { type: 'poster' }
  | { type: 'finish'; record: TripRecord; nextDraft: Draft }
  | { type: 'discard' };
