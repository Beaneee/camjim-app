import type { ComponentProps } from 'react';
import type MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ZoneId } from '../theme/tokens';

// 캠핑 짐 30개를 캠핑장 안내판처럼 다섯 구역으로 나눈다.
// 구역 순서대로 묻고, 구역 안에서는 큰 짐부터 묻는다.
// only: 그 계절에만 나옴 / pri: 그 계절엔 구역 안에서 앞으로 옴 / night: 당일 캠핑이면 자동으로 뺌
export type Season = 'mid' | 'summer' | 'winter';
export type Nights = 'day' | 'one' | 'two';
export type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type Zone = { id: ZoneId; code: string; name: string };

export const ZONES: Zone[] = [
  { id: 'home', code: 'A', name: '주거' },
  { id: 'kitchen', code: 'B', name: '주방' },
  { id: 'fire', code: 'C', name: '불·난방' },
  { id: 'power', code: 'D', name: '전기·조명' },
  { id: 'living', code: 'E', name: '생활' },
];
export const ZONE_BY_ID = Object.fromEntries(ZONES.map((z) => [z.id, z])) as Record<ZoneId, Zone>;

type ItemDef = {
  id: string;
  q: string;        // "텐트는?"
  q2?: string;      // 둘째 줄 질문 ("식기는?")
  icon: IconName;   // 출시용 아이콘 세트 (MaterialCommunityIcons)
  only?: Season;
  pri?: Season;
  night?: boolean;
  say?: string;     // 챙겼을 때 카드가 하는 말
};

export type Item = ItemDef & { zone: ZoneId; post: string };

// 구역별, 큰 짐 → 작은 짐 순서
const DEFS: Record<ZoneId, ItemDef[]> = {
  home: [
    { id: 'tent',    q: '텐트는?',     icon: 'tent', say: '그거 없으면 큰일나지' },
    { id: 'tarp',    q: '타프는?',     icon: 'awning-outline', say: '그늘 확보' },
    { id: 'floor',   q: '바닥공사는?', icon: 'rug' },
    { id: 'cot',     q: '야전침대는?', icon: 'bed-empty', night: true },
    { id: 'table',   q: '테이블은?',   icon: 'table-furniture' },
    { id: 'chair',   q: '의자는?',     icon: 'seat', say: '앉을 데가 있어야지' },
    { id: 'shelf',   q: '선반은?',     icon: 'library-shelves' },
    { id: 'box',     q: '수납박스는?', icon: 'package-variant-closed' },
    { id: 'tarpfan', q: '타프팬은?',   icon: 'ceiling-fan', only: 'summer' },
  ],
  kitchen: [
    { id: 'ice',    q: '아이스박스는?',  icon: 'snowflake', pri: 'summer', say: '맥주는 시원해야지' },
    { id: 'jug',    q: '워터저그는?',    icon: 'cup-water', pri: 'summer' },
    { id: 'burner', q: '가스버너는?',    icon: 'stove' },
    { id: 'cook',   q: '코펠은?', q2: '식기는?', icon: 'pot-steam' },
    { id: 'gas',    q: '부탄가스는?', q2: '토치는?', icon: 'gas-cylinder' },
    { id: 'dish',   q: '설거지 가방은?', icon: 'bucket' },
    { id: 'spice',  q: '양념통은?',      icon: 'shaker-outline' },
    { id: 'coffee', q: '커피는?',        icon: 'coffee', say: '아침이 살았다' },
  ],
  fire: [
    { id: 'heater',  q: '난로는?', q2: '팬히터는?', icon: 'radiator', only: 'winter', say: '겨울 캠핑의 생명줄' },
    { id: 'fire',    q: '화롯대는?', icon: 'grill', pri: 'winter', say: '불멍 준비 완료' },
    { id: 'wood',    q: '장작은?',   icon: 'campfire', pri: 'winter' },
    { id: 'blanket', q: '전기요는?', q2: '이불은?', icon: 'bed-king', pri: 'winter', night: true },
    { id: 'kero',    q: '등유통은?', q2: '소화기는?', icon: 'fire-extinguisher', only: 'winter', say: '소화기도 꼭!' },
  ],
  power: [
    { id: 'lantern', q: '랜턴은?',       icon: 'lightbulb-on-outline', night: true, say: '밤이 무섭지 않아' },
    { id: 'reel',    q: '릴선은?',       icon: 'power-plug' },
    { id: 'circ',    q: '써큘레이터는?', icon: 'fan', only: 'summer' },
  ],
  living: [
    { id: 'clothes', q: '옷은?',         icon: 'tshirt-crew', night: true },
    { id: 'wash',    q: '세면도구는?',   icon: 'toothbrush-paste', night: true },
    { id: 'tissue',  q: '휴지는?', q2: '물티슈는?', icon: 'paper-roll' },
    { id: 'gloves',  q: '장갑은?', q2: '망치는?', icon: 'hammer', say: '펙 박을 준비 끝' },
    { id: 'rope',    q: '비너는? 로프는?', q2: '데크팩은?', icon: 'carabiner', say: '야무지다' },
  ],
};

/** 말뚝 번호는 구역 기호 + 구역 안 순번 (B-3). 계절과 상관없이 짐마다 고정이다. */
export const ITEMS: Item[] = ZONES.flatMap((z) =>
  DEFS[z.id].map((d, i) => ({ ...d, zone: z.id, post: `${z.code}-${i + 1}` })),
);
export const ITEM_BY_ID: Record<string, Item> = Object.fromEntries(ITEMS.map((it) => [it.id, it]));

export const SEASONS: Record<Season, string> = { mid: '봄가을', summer: '여름', winter: '겨울' };
export const NIGHTS: Record<Nights, string> = { day: '당일', one: '1박', two: '2박 이상' };

export const YES_SAY = ['좋아, 다음!', '오케이, 넣었다', '이건 필수지', '역시', '하나 더 끝', '가자 가자', '든든하다'];
export const LATER_SAY = ['이따 다시 물어볼게', '트렁크 닫기 전에 또 볼게', '잊지 않게 따로 둘게'];
export const NO_SAY = ['그래, 이번엔 됐어', '가볍게 가자', '이번엔 빼자'];

export type Trip = { name: string; season: Season; nights: Nights; date: string };

/** 이번 캠핑에서 이 짐의 중요도. 말뚝 모양 한 가지 규칙으로만 표시한다. */
export type Importance = 'must' | 'normal' | 'skippedLast';

/**
 * 이번 캠핑에 맞는 카드 묶음과 자동으로 뺀 목록.
 * force에 든 짐은 자동으로 빼지 않고 다시 넣는다.
 */
export function buildDeck(trip: Pick<Trip, 'season' | 'nights'>, force: string[] = []) {
  const auto: Record<string, string> = {};
  const deck: Item[] = [];
  const forced = new Set(force);
  for (const z of ZONES) {
    const inZone: Item[] = [];
    for (const it of ITEMS.filter((x) => x.zone === z.id)) {
      if (!forced.has(it.id)) {
        if (it.only && it.only !== trip.season) { auto[it.id] = `${SEASONS[trip.season]}이라 뺐어요`; continue; }
        if (it.night && trip.nights === 'day') { auto[it.id] = '당일이라 뺐어요'; continue; }
      }
      inZone.push(it);
    }
    // 구역 안에서 이번 계절 필수 짐이 먼저 (안정 정렬이라 나머지는 큰 짐 순서 유지)
    const rank = (it: Item) => (it.pri === trip.season || it.only === trip.season ? 0 : 1);
    deck.push(...inZone.sort((a, b) => rank(a) - rank(b)));
  }
  return { deck, auto };
}

export function importanceOf(it: Item, season: Season, skippedLast: boolean): Importance {
  if (it.pri === season || it.only === season) return 'must';
  if (skippedLast) return 'skippedLast';
  return 'normal';
}

/** 지금 구역의 처음과 끝 짐 이름 (안내판 띠에 쓰는 안내어) */
export function zoneSpan(deck: Item[], zone: ZoneId) {
  const inZone = deck.filter((it) => it.zone === zone);
  return { first: inZone[0], last: inZone[inZone.length - 1], count: inZone.length };
}

/** "텐트는?" → "텐트" */
export function shortName(q: string) {
  return q.replace(/[은는]\?/g, '').trim();
}
export function itemName(it: Item) {
  return it.q2 ? `${shortName(it.q)} · ${shortName(it.q2)}` : shortName(it.q);
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
