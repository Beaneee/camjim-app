import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { Linking } from 'react-native';
import { CAPTURE_ON, captureFlags, captureState, parseCaptureUrl } from './capture';
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
function devInit(s: AppState): AppState {
  const screen = process.env.EXPO_PUBLIC_DEV_SCREEN;
  if (screen !== 'deck' && screen !== 'poster') return s;
  return captureState(s, screen, process.env.EXPO_PUBLIC_DEV_PLAN ?? '');
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, devInit);
  const [captureKey, setCaptureKey] = useState(0);

  // 캡처 모드에서만: 딥 링크로 상태를 바꾸고, 화면을 새로 그려 스크롤·엔딩 지시를 적용한다.
  useEffect(() => {
    if (!CAPTURE_ON) return;
    const apply = (url: string | null) => {
      const p = parseCaptureUrl(url);
      if (!p) return;
      captureFlags.scroll = p.scroll === 'end';
      captureFlags.hold = p.hold === '1';
      dispatch({ type: 'hydrate', state: captureState(initialState, p.screen, p.plan ?? '') });
      setCaptureKey((k) => k + 1);
    };
    Linking.getInitialURL().then(apply).catch(() => {});
    const sub = Linking.addEventListener('url', (e) => apply(e.url));
    return () => sub.remove();
  }, []);

  // 기기 저장(AsyncStorage)은 harden 단계에서 붙인다.
  return <Ctx.Provider value={{ state, dispatch, captureKey }}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const v = useContext(Ctx);
  if (!v) throw new Error('useStore는 StoreProvider 안에서만 쓸 수 있어요');
  return v;
}
