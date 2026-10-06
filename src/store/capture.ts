/**
 * 화면 캡처 전용 도구. 디자인 리뷰용 스크린샷을 찍을 때만 켠다.
 *   EXPO_PUBLIC_CAPTURE=1 npx expo start
 * 켜져 있으면 딥 링크로 상태를 바꾼다 (JS를 다시 불러오지 않으므로 개발용 배너가 뜨지 않는다):
 *   com.anonymous.camjim://capture?screen=deck&plan=yyyl&scroll=end&hold=1
 * 일반·출시 빌드에서는 EXPO_PUBLIC_CAPTURE가 비어 있어 아무 일도 하지 않는다.
 */
import { buildDeck } from '../data/items';
import { reducer } from './reducer';
import type { AppState, Result } from './types';

export const CAPTURE_ON = process.env.EXPO_PUBLIC_CAPTURE === '1';

/** 캡처 중인 화면에 주는 지시: 맨 아래로 스크롤 / 엔딩 장면 멈춤 */
export const captureFlags = { scroll: false, hold: false };

/** 겨울 1박 가평 캠핑에서 plan(y=챙겼다, l=나중에, n=필요 없어)대로 답한 상태 */
export function captureState(base: AppState, screen: string | undefined, plan: string): AppState {
  if (screen !== 'deck' && screen !== 'poster') return { ...base, screen: 'setup', trip: null };
  const trip = { name: '가평 1박', season: 'winter' as const, nights: 'one' as const, date: new Date().toISOString() };
  let next = reducer(base, { type: 'start', trip, force: [] });
  const deckIds = buildDeck(trip).deck.map((it) => it.id);
  const map: Record<string, Result> = { y: 'yes', l: 'later', n: 'no' };
  for (const ch of plan) {
    const id = next.round === 'later' ? next.queue[next.j] : deckIds[next.i];
    if (!id || next.round === 'done' || !map[ch]) break;
    next = reducer(next, { type: 'answer', id, result: map[ch], deckIds });
  }
  return screen === 'poster' ? reducer(next, { type: 'poster' }) : next;
}

/** "scheme://capture?a=1&b=2" → { a: '1', b: '2' } (캡처 링크가 아니면 null) */
export function parseCaptureUrl(url: string | null): Record<string, string> | null {
  if (!url || !/:\/\/capture\b/.test(url)) return null;
  const q = url.split('?')[1] ?? '';
  return Object.fromEntries(
    q.split('&').filter(Boolean).map((kv) => {
      const [k, v = ''] = kv.split('=');
      return [decodeURIComponent(k), decodeURIComponent(v)];
    }),
  );
}
