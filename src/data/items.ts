// 캠핑 짐 30개. 짐 싸는 순서(큰 것 → 작은 것)대로 나열.
// only: 그 계절에만 나옴 / pri: 그 계절엔 앞으로 옴 / night: 당일 캠핑이면 자동 패스
export type Season = 'mid' | 'summer' | 'winter';
export type Nights = 'day' | 'one' | 'two';

export type Item = {
  id: string;
  q: string;        // "텐트는?"
  q2?: string;      // 둘째 줄 질문 ("식기는?")
  glyph: string;    // 자리표시자 이모지. 실제 일러스트로 교체 예정
  first?: boolean;  // 항상 첫 카드
  only?: Season;
  pri?: Season;
  night?: boolean;
  say?: string;     // 챙겼을 때 카드가 하는 말
};

export const SEASONS: Record<Season, string> = { mid: '봄가을', summer: '여름', winter: '겨울' };
export const NIGHTS: Record<Nights, string> = { day: '당일', one: '1박', two: '2박 이상' };

export const ITEMS: Item[] = [
  { id: 'tent',    q: '텐트는?',        glyph: '⛺', first: true, say: '그거 없으면 큰일나지' },
  { id: 'tarp',    q: '타프는?',        glyph: '🏕️', say: '그늘 확보' },
  { id: 'tarpfan', q: '타프팬은?',      glyph: '🌀', only: 'summer' },
  { id: 'table',   q: '테이블은?',      glyph: '🍽️' },
  { id: 'chair',   q: '의자는?',        glyph: '🪑', say: '앉을 데가 있어야지' },
  { id: 'cot',     q: '야전침대는?',    glyph: '🛏️', night: true },
  { id: 'floor',   q: '바닥공사는?',    glyph: '🧱' },
  { id: 'fire',    q: '화롯대는?',      glyph: '🔥', pri: 'winter', say: '불멍 준비 완료' },
  { id: 'wood',    q: '장작은?',        glyph: '🪵', pri: 'winter' },
  { id: 'shelf',   q: '선반은?',        glyph: '🗄️' },
  { id: 'box',     q: '수납박스는?',    glyph: '📦' },
  { id: 'ice',     q: '아이스박스는?',  glyph: '🧊', pri: 'summer', say: '맥주는 시원해야지' },
  { id: 'jug',     q: '워터저그는?',    glyph: '🚰', pri: 'summer' },
  { id: 'burner',  q: '가스버너는?',    glyph: '🍳' },
  { id: 'cook',    q: '코펠은?', q2: '식기는?', glyph: '🥘' },
  { id: 'spice',   q: '양념통은?',      glyph: '🧂' },
  { id: 'dish',    q: '설거지 가방은?', glyph: '🧽' },
  { id: 'coffee',  q: '커피는?',        glyph: '☕', say: '아침이 살았다' },
  { id: 'gas',     q: '부탄가스는?', q2: '토치는?', glyph: '🔦' },
  { id: 'heater',  q: '난로는?', q2: '팬히터는?', glyph: '♨️', only: 'winter', say: '겨울 캠핑의 생명줄' },
  { id: 'kero',    q: '등유통은?', q2: '소화기는?', glyph: '🧯', only: 'winter', say: '소화기도 꼭!' },
  { id: 'lantern', q: '랜턴은?',        glyph: '🏮', night: true, say: '밤이 무섭지 않아' },
  { id: 'blanket', q: '전기요는?', q2: '이불은?', glyph: '🛌', pri: 'winter', night: true },
  { id: 'reel',    q: '릴선은?',        glyph: '🔌' },
  { id: 'circ',    q: '써큘레이터는?',  glyph: '🌬️', only: 'summer' },
  { id: 'wash',    q: '세면도구는?',    glyph: '🪥', night: true },
  { id: 'tissue',  q: '휴지는?', q2: '물티슈는?', glyph: '🧻' },
  { id: 'clothes', q: '옷은?',          glyph: '👕', night: true },
  { id: 'gloves',  q: '장갑은?', q2: '망치는?', glyph: '🔨', say: '펙 박을 준비 끝' },
  { id: 'rope',    q: '비너는? 로프는?', q2: '데크팩은?', glyph: '🪢', say: '야무지다' },
];

export const ITEM_BY_ID: Record<string, Item> = Object.fromEntries(ITEMS.map((it) => [it.id, it]));

export const YES_SAY = ['좋아, 다음!', '오케이, 넣었다', '이건 필수지', '역시', '하나 더 끝', '가자 가자', '든든하다'];
export const PASS_SAY = ['그래, 이번엔 됐어', '가볍게 가자', '다음에 챙기지 뭐', '이번엔 빼자'];

export type Trip = { name: string; season: Season; nights: Nights; date: string };

/** 이번 캠핑에 맞는 카드 묶음과 자동 패스 목록. force에 든 항목은 자동 패스를 무시하고 다시 넣는다. */
export function buildDeck(trip: Pick<Trip, 'season' | 'nights'>, force: string[] = []) {
  const auto: Record<string, string> = {};
  const deck: Item[] = [];
  const forced = new Set(force);
  for (const it of ITEMS) {
    if (!forced.has(it.id)) {
      if (it.only && it.only !== trip.season) { auto[it.id] = `${SEASONS[trip.season]}이라 패스`; continue; }
      if (it.night && trip.nights === 'day') { auto[it.id] = '당일이라 패스'; continue; }
    }
    deck.push(it);
  }
  const rank = (it: Item) => (it.first ? 0 : it.pri === trip.season || it.only === trip.season ? 1 : 2);
  deck.sort((a, b) => rank(a) - rank(b)); // Array.sort는 안정 정렬이라 기본 순서 유지
  return { deck, auto };
}

/** "텐트는?" → "텐트" */
export function shortName(q: string) {
  return q.replace(/[은는]\?/g, '').trim();
}

export function defaultSeason(d = new Date()): Season {
  const m = d.getMonth() + 1;
  if (m >= 6 && m <= 8) return 'summer';
  if (m >= 11 || m <= 2) return 'winter';
  return 'mid';
}

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
