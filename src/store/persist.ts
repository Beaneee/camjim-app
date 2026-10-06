import AsyncStorage from '@react-native-async-storage/async-storage';
import { ITEM_BY_ID } from '../data/items';
import { initialState } from './reducer';
import type { AppState, TripRecord } from './types';

/**
 * 기기 저장. 서버도 계정도 없이 이 기기에만 남는다.
 * 저장 형식이 바뀌면 VERSION을 올린다. 읽은 값이 형식에 맞지 않으면
 * 지난 캠핑 기록만 살리고 진행 중이던 짐 싸기는 버린다 (앱이 멈추는 것보다 낫다).
 */
const KEY = 'camjim/state';
const VERSION = 2;

type Saved = { v: number; state: AppState };

const SCREENS = new Set(['setup', 'deck', 'poster']);
const ROUNDS = new Set(['main', 'later', 'done']);
const RESULTS = new Set(['yes', 'later', 'no']);

function isStringArray(x: unknown): x is string[] {
  return Array.isArray(x) && x.every((v) => typeof v === 'string');
}

function validRecord(r: any): r is TripRecord {
  return (
    r && typeof r.name === 'string' && typeof r.date === 'string' &&
    typeof r.season === 'string' && typeof r.nights === 'string' &&
    isStringArray(r.yes) && isStringArray(r.no) && isStringArray(r.later ?? []) && isStringArray(r.auto ?? [])
  );
}

/** 지난 캠핑 기록만 따로 건진다 (형식이 바뀌어도 기록은 잃지 않게) */
function salvageHistory(raw: any): TripRecord[] {
  const h = raw?.state?.history ?? raw?.history;
  if (!Array.isArray(h)) return [];
  return h.filter(validRecord).map((r) => ({ ...r, later: r.later ?? [], auto: r.auto ?? [] })).slice(0, 10);
}

function validState(s: any): s is AppState {
  if (!s || !SCREENS.has(s.screen) || !ROUNDS.has(s.round)) return false;
  if (typeof s.i !== 'number' || typeof s.j !== 'number' || !isStringArray(s.queue) || !isStringArray(s.force)) return false;
  if (!s.res || typeof s.res !== 'object') return false;
  // 답 기록: 알 수 없는 짐이나 답이 섞여 있으면 진행 상태를 믿지 않는다
  for (const [id, r] of Object.entries(s.res)) {
    if (!ITEM_BY_ID[id] || !RESULTS.has(r as string)) return false;
  }
  if (s.screen !== 'setup' && (!s.trip || typeof s.trip.name !== 'string')) return false;
  return Array.isArray(s.history);
}

export async function loadState(): Promise<AppState | null> {
  let text: string | null = null;
  try {
    text = await AsyncStorage.getItem(KEY);
  } catch (e) {
    console.warn('[camjim] 저장된 진행 상태를 읽지 못했어요. 처음 화면부터 시작합니다.', e);
    return null;
  }
  if (!text) return null;
  let raw: any;
  try {
    raw = JSON.parse(text);
  } catch {
    console.warn('[camjim] 저장 데이터가 손상돼서 처음부터 시작합니다.');
    return null;
  }
  const saved = raw as Saved;
  if (saved?.v === VERSION && validState(saved.state)) {
    return { ...saved.state, history: salvageHistory(saved) };
  }
  // 형식이 다르거나 깨진 경우: 기록만 살린다
  const history = salvageHistory(raw);
  return history.length ? { ...initialState, history } : null;
}

export async function saveState(state: AppState): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify({ v: VERSION, state } satisfies Saved));
  } catch (e) {
    // 저장 실패는 화면을 막지 않는다. 다음 변경 때 다시 시도한다.
    console.warn('[camjim] 진행 상태를 저장하지 못했어요.', e);
  }
}
