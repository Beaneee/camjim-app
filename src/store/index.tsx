import React, { createContext, useContext, useEffect, useReducer, useRef, useState } from 'react';
import { AppState as RNAppState, Linking } from 'react-native';
import { CAPTURE_ON, captureFlags, captureState, parseCaptureUrl } from './capture';
import { loadState, saveState } from './persist';
import { initialState, reducer } from './reducer';
import type { Action, AppState } from './types';

export type { AppState, Action, Draft, Result, Round, Screen, TripRecord } from './types';

type Store = { state: AppState; dispatch: React.Dispatch<Action>; captureKey: number };
const Ctx = createContext<Store | null>(null);

/**
 * 개발 중 특정 상태로 바로 열기 (화면 확인용, 일반·출시 빌드에서는 변수가 비어 있어 영향 없음):
 *   EXPO_PUBLIC_DEV_SCREEN=deck|poster   어느 화면으로 열지
 *   EXPO_PUBLIC_DEV_PLAN=yyylyn          앞 카드부터 y=챙겼다, l=나중에, n=필요 없어
 * 리뷰용 캡처는 capture.ts의 딥 링크 방식을 쓴다.
 */
const DEV_SCREEN = process.env.EXPO_PUBLIC_DEV_SCREEN;
function devInit(s: AppState): AppState {
  if (DEV_SCREEN !== 'deck' && DEV_SCREEN !== 'poster') return s;
  return captureState(s, DEV_SCREEN, process.env.EXPO_PUBLIC_DEV_PLAN ?? '');
}

/** 캡처·개발용 상태는 기기 저장을 읽지도 덮어쓰지도 않는다 */
const PERSIST = !CAPTURE_ON && DEV_SCREEN !== 'deck' && DEV_SCREEN !== 'poster';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, devInit);
  const [captureKey, setCaptureKey] = useState(0);
  const [ready, setReady] = useState(!PERSIST);

  // ---- 앱을 켜면 저장된 진행 상태를 불러온다 (하던 화면으로 돌아간다)
  useEffect(() => {
    if (!PERSIST) return;
    let alive = true;
    loadState().then((saved) => {
      if (!alive) return;
      if (saved) dispatch({ type: 'hydrate', state: saved });
      setReady(true);
    });
    return () => { alive = false; };
  }, []);

  // ---- 바뀔 때마다 저장한다. 짧게 몰아서 쓰고, 앱이 뒤로 가면 바로 쓴다.
  const latest = useRef(state);
  latest.current = state;
  useEffect(() => {
    if (!PERSIST || !ready) return;
    const t = setTimeout(() => saveState(state), 250);
    return () => clearTimeout(t);
  }, [state, ready]);
  useEffect(() => {
    if (!PERSIST) return;
    const sub = RNAppState.addEventListener('change', (next) => {
      if (next !== 'active' && ready) saveState(latest.current);
    });
    return () => sub.remove();
  }, [ready]);

  // ---- 캡처 모드에서만: 딥 링크로 상태를 바꾸고, 화면을 새로 그려 스크롤·엔딩 지시를 적용한다.
  useEffect(() => {
    if (!CAPTURE_ON) return;
    const apply = (url: string | null) => {
      const p = parseCaptureUrl(url);
      if (!p) return;
      captureFlags.scroll = p.scroll === 'end';
      captureFlags.hold = p.hold === '1';
      const base = p.history === '1' ? { ...initialState, history: SAMPLE_HISTORY } : initialState;
      let next = captureState(base, p.screen, p.plan ?? '');
      if (p.paused === '1') next = reducer(next, { type: 'pause' });
      dispatch({ type: 'hydrate', state: next });
      setCaptureKey((k) => k + 1);
    };
    Linking.getInitialURL().then(apply).catch(() => {});
    const sub = Linking.addEventListener('url', (e) => apply(e.url));
    return () => sub.remove();
  }, []);

  // 저장된 상태를 읽는 동안에는 그리지 않는다 (스플래시가 덮고 있다)
  if (!ready) return null;
  return <Ctx.Provider value={{ state, dispatch, captureKey }}>{children}</Ctx.Provider>;
}

/** 캡처용 예시 기록 (history=1). 화면에 '예시'로 보이는 데이터가 아니라 캡처 링크 전용이다. */
const SAMPLE_HISTORY: AppState['history'] = CAPTURE_ON
  ? [{ name: '홍천 2박', season: 'mid', nights: 'two', date: '2026-09-20T09:00:00.000Z', yes: ['tent', 'tarp', 'chair'], later: [], no: ['cot', 'coffee'], auto: ['tarpfan'] }]
  : [];

export function useStore(): Store {
  const v = useContext(Ctx);
  if (!v) throw new Error('useStore는 StoreProvider 안에서만 쓸 수 있어요');
  return v;
}
