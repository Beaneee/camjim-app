import React, { createContext, useContext, useReducer } from 'react';
import { initialState, reducer } from './reducer';
import type { Action, AppState } from './types';

export type { AppState, Action, Draft, Result, Screen, TripRecord } from './types';

type Store = { state: AppState; dispatch: React.Dispatch<Action> };
const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  // 기기 저장(AsyncStorage)은 5단계에서 붙인다.
  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const v = useContext(Ctx);
  if (!v) throw new Error('useStore는 StoreProvider 안에서만 쓸 수 있어요');
  return v;
}
