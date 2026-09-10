import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Pen, Sans } from '../components/Typo';
import { useStore } from '../store';
import { radius, space, useTheme } from '../theme';
import { defaultSeason } from '../data/items';

// 2단계에서 실제 화면으로 채운다. 지금은 화면 전환 뼈대 확인용.
export function SetupScreen() {
  const { c } = useTheme();
  const { dispatch } = useStore();
  return (
    <View style={styles.wrap}>
      <Pen size={30}>캠핑 짐 체크</Pen>
      <Sans color={c.muted}>시작 화면 (2단계에서 채움)</Sans>
      <Pressable
        onPress={() =>
          dispatch({
            type: 'start',
            trip: { name: '테스트 캠핑', season: defaultSeason(), nights: 'one', date: new Date().toISOString() },
          })
        }
        style={[styles.btn, { backgroundColor: c.olive }]}>
        <Sans color={c.oliveInk} style={styles.btnText}>짐 싸기 시작</Sans>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, gap: space.lg, justifyContent: 'center' },
  btn: { paddingVertical: 15, alignItems: 'center', borderRadius: radius.button },
  btnText: { fontWeight: '700', fontSize: 18 },
});
