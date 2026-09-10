import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Pen, Sans } from '../components/Typo';
import { useStore } from '../store';
import { radius, space, useTheme } from '../theme';

// 5단계에서 포스터 격자와 기록 저장으로 채운다.
export function PosterScreen() {
  const { c } = useTheme();
  const { state, dispatch } = useStore();
  const yes = Object.values(state.res).filter((r) => r === 'yes').length;
  const pass = Object.values(state.res).filter((r) => r === 'pass').length;
  return (
    <View style={styles.wrap}>
      <Pen size={40}>{state.trip?.name}</Pen>
      <Sans color={c.muted}>챙김 {yes} · 패스 {pass}</Sans>
      <Sans color={c.muted}>포스터 화면 (5단계에서 채움)</Sans>
      <Pressable onPress={() => dispatch({ type: 'discard' })} style={[styles.btn, { borderColor: c.line }]}>
        <Sans color={c.inkSoft} style={styles.btnText}>처음으로</Sans>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, gap: space.lg, justifyContent: 'center' },
  btn: { paddingVertical: 15, alignItems: 'center', borderRadius: radius.button, borderWidth: 1.5 },
  btnText: { fontWeight: '700', fontSize: 16 },
});
