import React, { useMemo } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Button } from '../components/Button';
import { Segmented } from '../components/Segmented';
import { Label, Pen, Sans } from '../components/Typo';
import { buildDeck, defaultSeason, NIGHTS, SEASONS, shortName, type Nights, type Season } from '../data/items';
import { useStore, type Draft } from '../store';
import { fonts, radius, space, useTheme } from '../theme';

function fmtDate(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export function SetupScreen() {
  const { c } = useTheme();
  const { state, dispatch } = useStore();
  const last = state.history[0];

  // 초안이 없으면 오늘 계절과 지난 캠핑의 박수로 시작
  const draft: Draft = state.draft ?? { name: '', season: defaultSeason(), nights: last?.nights ?? 'one' };

  const { deck, auto } = useMemo(() => buildDeck(draft), [draft.season, draft.nights]);
  const autoN = Object.keys(auto).length;
  const priNames = deck
    .filter((it) => it.pri === draft.season || it.only === draft.season)
    .map((it) => shortName(it.q));

  const set = (patch: Partial<Draft>) => dispatch({ type: 'draft', draft: { ...draft, ...patch } });

  const start = () => {
    const name = draft.name.trim() || `${SEASONS[draft.season]} 캠핑`;
    dispatch({
      type: 'start',
      trip: { name, season: draft.season, nights: draft.nights, date: new Date().toISOString() },
    });
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View>
          <Pen size={30}>캠핑 짐 체크</Pen>
          <Sans size={12} color={c.muted}>이번 캠핑에 맞춰 카드를 골라줄게요</Sans>
        </View>

        <View style={styles.field}>
          <Label>캠핑 이름</Label>
          <TextInput
            value={draft.name}
            onChangeText={(name) => set({ name })}
            onSubmitEditing={start}
            placeholder="가평 1박"
            placeholderTextColor={c.line}
            maxLength={14}
            returnKeyType="done"
            style={[styles.input, { fontFamily: fonts.pen, color: c.ink, backgroundColor: c.card, borderColor: c.line }]}
          />
        </View>

        <View style={styles.field}>
          <Label>계절</Label>
          <Segmented<Season> options={SEASONS} value={draft.season} onChange={(season) => set({ season })} />
        </View>

        <View style={styles.field}>
          <Label>얼마나</Label>
          <Segmented<Nights> options={NIGHTS} value={draft.nights} onChange={(nights) => set({ nights })} />
        </View>

        <View style={[styles.plan, { backgroundColor: c.card, borderColor: c.line }]}>
          <Sans size={13} color={c.inkSoft}>
            카드 <Sans size={13} style={styles.bold}>{deck.length}장</Sans>
            {autoN ? <>, 자동 패스 <Sans size={13} style={styles.bold}>{autoN}장</Sans></> : null}.{' '}
            {priNames.length ? `${priNames.join(', ')}부터 먼저 물어볼게요.` : '큰 짐부터 순서대로 물어볼게요.'}
            {last ? `\n지난 캠핑(${last.name})에서 패스했던 건 카드에 표시해 둘게요.` : ''}
          </Sans>
        </View>

        <Button title="짐 싸기 시작" variant="primary" size="lg" onPress={start} />

        <View style={styles.history}>
          <Label>지난 캠핑</Label>
          {state.history.length === 0 ? (
            <Sans size={13} color={c.muted}>아직 없어요. 첫 캠핑을 기록해 보세요.</Sans>
          ) : (
            state.history.slice(0, 4).map((h, i) => (
              <View key={h.date + i} style={[styles.row, { backgroundColor: c.card, borderColor: c.line }]}>
                <Pen size={24}>{h.name}</Pen>
                <Sans size={12} color={c.muted}>
                  {fmtDate(h.date)} · {SEASONS[h.season]} {NIGHTS[h.nights]} · 챙김 {h.yes.length} 패스 {h.pass.length}
                </Sans>
              </View>
            ))
          )}
        </View>

        <Sans size={12} color={c.muted} style={styles.foot}>
          그림은 자리표시자예요. 나중에 실제 일러스트로 바꿔 끼우면 돼요.
        </Sans>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  wrap: { gap: space.lg, paddingBottom: space.xxl },
  field: { gap: space.sm },
  input: { fontSize: 34, lineHeight: 38, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1.5, borderRadius: radius.button },
  plan: { borderWidth: 1.5, borderStyle: 'dashed', borderRadius: radius.button, paddingHorizontal: 14, paddingVertical: 12 },
  bold: { fontWeight: '700' },
  history: { gap: space.sm },
  row: { borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, gap: 4 },
  foot: { textAlign: 'center' },
});
