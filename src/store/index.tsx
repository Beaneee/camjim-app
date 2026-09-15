import React, { createContext, useContext, useReducer } from 'react';
import { buildDeck } from '../data/items';
import { initialState, reducer } from './reducer';
import type { Action, AppState } from './types';

export type { AppState, Action, Draft, Result, Screen, TripRecord } from './types';

type Store = { state: AppState; dispatch: React.Dispatch<Action> };
const Ctx = createContext<Store | null>(null);

/**
 * 개발 중 특정 화면을 바로 열기:
 *   EXPO_PUBLIC_DEV_SCREEN=deck EXPO_PUBLIC_DEV_YES=5 npx expo start
 * (덱 화면, 앞 5장은 이미 챙긴 상태로)
 */
function devInit(s: AppState): AppState {
  if (!__DEV__ || process.env.EXPO_PUBLIC_DEV_SCREEN !== 'deck') return s;
  const trip = { name: '가평 1박', season: 'winter' as const, nights: 'one' as const, date: new Date().toISOString() };
  let next = reducer(s, { type: 'start', trip });
  const n = Number(process.env.EXPO_PUBLIC_DEV_YES ?? 0);
  const { deck } = buildDeck(trip);
  for (let i = 0; i < n && i < deck.length; i++) {
    next = reducer(next, { type: 'answer', id: deck[i].id, result: 'yes' });
    next = reducer(next, { type: 'advance' });
  }
  return next;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, devInit);
  // 기기 저장(AsyncStorage)은 5단계에서 붙인다.
  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const v = useContext(Ctx);
  if (!v) throw new Error('useStore는 StoreProvider 안에서만 쓸 수 있어요');
  return v;
}
