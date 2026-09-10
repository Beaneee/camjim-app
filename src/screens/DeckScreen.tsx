import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Pen, Sans } from '../components/Typo';
import { buildDeck } from '../data/items';
import { useStore } from '../store';
import { radius, space, useTheme } from '../theme';

// 3·4단계에서 카드 스택과 트렁크로 채운다. 지금은 데이터가 제대로 나오는지 확인용.
export function DeckScreen() {
  const { c } = useTheme();
  const { state, dispatch } = useStore();
  const trip = state.trip!;
  const { deck, auto } = buildDeck(trip, state.force);
  const item = deck[state.i];

  return (
    <View style={styles.wrap}>
      <Sans color={c.muted}>
        {trip.name} · 카드 {deck.length}장 · 자동 패스 {Object.keys(auto).length}장
      </Sans>
      {item ? (
        <View style={[styles.card, { backgroundColor: c.card, borderColor: c.line }]}>
          <Pen>{item.q}</Pen>
          {item.q2 ? <Pen size={28} color={c.inkSoft}>{item.q2}</Pen> : null}
          <Sans size={80} style={styles.glyph}>{item.glyph}</Sans>
          <Sans color={c.muted}>{state.i + 1} / {deck.length}</Sans>
        </View>
      ) : (
        <Pen size={34} color={c.inkSoft}>짐 다 실었다!</Pen>
      )}
      <View style={styles.row}>
        <Pressable
          disabled={!item}
          onPress={() => { dispatch({ type: 'answer', id: item!.id, result: 'pass' }); dispatch({ type: 'advance' }); }}
          style={[styles.btn, { backgroundColor: c.card, borderColor: c.line }]}>
          <Sans color={c.inkSoft} style={styles.btnText}>이번엔 패스</Sans>
        </Pressable>
        <Pressable
          disabled={!item}
          onPress={() => { dispatch({ type: 'answer', id: item!.id, result: 'yes' }); dispatch({ type: 'advance' }); }}
          style={[styles.btn, styles.primary, { backgroundColor: c.olive, borderColor: c.olive }]}>
          <Sans color={c.oliveInk} style={styles.btnText}>챙겼다!</Sans>
        </Pressable>
      </View>
      {!item ? (
        <Pressable onPress={() => dispatch({ type: 'poster' })} style={[styles.btn, { borderColor: c.line }]}>
          <Sans color={c.inkSoft} style={styles.btnText}>포스터 보기</Sans>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, gap: space.lg, justifyContent: 'center' },
  card: { borderWidth: 1.5, borderRadius: radius.card, padding: space.xl, gap: space.sm, alignItems: 'flex-start' },
  glyph: { alignSelf: 'center', lineHeight: 96 },
  row: { flexDirection: 'row', gap: space.sm },
  btn: { flex: 1, paddingVertical: 15, alignItems: 'center', borderRadius: radius.button, borderWidth: 1.5 },
  primary: { flex: 1.6 },
  btnText: { fontWeight: '700', fontSize: 16 },
});
