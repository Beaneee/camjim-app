import React, { useEffect, useMemo, useRef } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Band } from '../components/Band';
import { Button } from '../components/Button';
import { ItemMark } from '../components/Marker';
import { Segmented } from '../components/Segmented';
import { Display, Label, Sans } from '../components/Typo';
import {
  buildDeck,
  defaultSeason,
  ITEM_BY_ID,
  itemName,
  NIGHTS,
  SEASONS,
  ZONES,
  type Nights,
  type Season,
} from '../data/items';
import { captureFlags } from '../store/capture';
import { useStore, type Draft } from '../store';
import { familyFor, minTouch, radius, space, useTheme } from '../theme';

function fmtDate(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export function SetupScreen() {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const { state, dispatch } = useStore();
  // 화면 캡처용: EXPO_PUBLIC_DEV_SCROLL=end 일 때 맨 아래로 (일반·출시 빌드에서는 비어 있음)
  const scroller = useRef<ScrollView>(null);
  useEffect(() => {
    if (process.env.EXPO_PUBLIC_DEV_SCROLL === 'end' || captureFlags.scroll) setTimeout(() => scroller.current?.scrollToEnd({ animated: false }), 600);
  }, []);
  const last = state.history[0];

  // 초안이 없으면 오늘 계절과 지난 캠핑의 기간으로 시작
  const draft: Draft = state.draft ?? {
    name: '',
    season: defaultSeason(),
    nights: last?.nights ?? 'one',
    force: [],
  };

  const { deck } = useMemo(() => buildDeck(draft, draft.force), [draft.season, draft.nights, draft.force]);
  // 이번 계절·기간이면 원래 빠지는 짐 (다시 넣은 짐 포함)
  const wouldSkip = useMemo(() => buildDeck(draft, []).auto, [draft.season, draft.nights]);
  const skipIds = Object.keys(wouldSkip);

  const set = (patch: Partial<Draft>) => dispatch({ type: 'draft', draft: { ...draft, ...patch } });

  const doStart = () => {
    const name = draft.name.trim() || `${SEASONS[draft.season]} 캠핑`;
    dispatch({
      type: 'start',
      trip: { name, season: draft.season, nights: draft.nights, date: new Date().toISOString() },
      force: draft.force.filter((id) => skipIds.includes(id)),
    });
  };

  // 멈춰 둔 캠핑이 있으면 새로 시작하기 전에 확인한다 (덮어쓰면 그 답이 사라진다)
  const paused = state.trip;
  const answered = Object.keys(state.res).length;
  const start = () => {
    if (!paused) return doStart();
    Alert.alert(`'${paused.name}'을(를) 지우고 새로 시작할까요?`, `지금까지 답한 ${answered}개가 지워져요.`, [
      { text: '취소', style: 'cancel' },
      { text: '새로 시작', style: 'destructive', onPress: doStart },
    ]);
  };

  return (
    <View style={styles.flex}>
      <Band>
        <Display size={22} color={c.onBand}>캠짐</Display>
        <Sans size={15} color={c.bandSoft}>이번 캠핑에 맞춰 짐 카드를 골라 줄게요</Sans>
      </Band>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
        ref={scroller}
          contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + space.xxl }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {paused ? (
            <View style={[styles.resume, { backgroundColor: c.card, borderColor: c.control }]}>
              <Label size={13} color={c.inkSoft}>짐 싸는 중</Label>
              <Display size={20}>{paused.name}</Display>
              <Sans size={13} color={c.inkSoft} style={styles.num}>
                {SEASONS[paused.season]} {NIGHTS[paused.nights]} · {answered}개 답함
              </Sans>
              <Button title="이어서 하기" icon="play" variant="primary" onPress={() => dispatch({ type: 'resume' })} />
            </View>
          ) : null}

          <View style={styles.field}>
            <Label size={13} color={c.inkSoft} nativeID="trip-name-label">캠핑 이름</Label>
            <TextInput
              value={draft.name}
              onChangeText={(name) => set({ name })}
              placeholder="가평 1박"
              placeholderTextColor={c.muted}
              maxLength={14}
              returnKeyType="done"
              accessibilityLabel="캠핑 이름"
              accessibilityLabelledBy="trip-name-label"
              style={[
                styles.input,
                { fontFamily: familyFor('600'), color: c.ink, backgroundColor: c.card, borderColor: c.control },
              ]}
            />
          </View>

          <View style={styles.field}>
            <Label size={13} color={c.inkSoft}>계절</Label>
            <Segmented<Season> label="계절" options={SEASONS} value={draft.season} onChange={(season) => set({ season })} />
          </View>

          <View style={styles.field}>
            <Label size={13} color={c.inkSoft}>기간</Label>
            <Segmented<Nights> label="기간" options={NIGHTS} value={draft.nights} onChange={(nights) => set({ nights })} />
          </View>

          <View style={styles.section}>
            <Display size={17} weight="700">짐 카드 {deck.length}장</Display>
            <View style={styles.legend} accessibilityLabel={ZONES.map((z) => `${z.name} ${deck.filter((it) => it.zone === z.id).length}장`).join(', ')}>
              {ZONES.map((z) => {
                const n = deck.filter((it) => it.zone === z.id).length;
                return (
                  <View key={z.id} style={styles.legendItem}>
                    <View style={[styles.swatch, { backgroundColor: c.zones[z.id].fill, borderColor: c.zones[z.id].edge }]} />
                    <Sans size={13} weight="600" color={c.ink}>{z.name}</Sans>
                    <Sans size={13} color={c.muted} style={styles.num}>{n}</Sans>
                  </View>
                );
              })}
            </View>
            <Sans size={13} color={c.inkSoft}>구역 순서대로, 구역 안에서는 큰 짐부터 물어볼게요.</Sans>
          </View>

          {skipIds.length ? (
            <View style={styles.section}>
              <Label size={13} color={c.inkSoft}>이번엔 뺄게요</Label>
              <View>
                {skipIds.map((id, idx) => {
                  const it = ITEM_BY_ID[id];
                  const added = draft.force.includes(id);
                  return (
                    <View
                      key={id}
                      style={[styles.row, idx > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.control }]}>
                      <ItemMark item={it} size="row" color={added ? undefined : c.muted} />
                      <View style={styles.rowText}>
                        <Sans size={15} weight="600" color={added ? c.ink : c.inkSoft}>{itemName(it)}</Sans>
                        <Sans size={12} weight="500" color={c.muted}>{added ? '다시 넣었어요' : wouldSkip[id]}</Sans>
                      </View>
                      <Button
                        variant="text"
                        title={added ? '다시 빼기' : '넣기'}
                        accessibilityLabel={`${itemName(it)} ${added ? '다시 빼기' : '넣기'}`}
                        onPress={() => dispatch({ type: 'toggleDraftForce', id })}
                      />
                    </View>
                  );
                })}
              </View>
            </View>
          ) : null}

          {last ? (
            <Sans size={13} color={c.inkSoft}>
              지난 캠핑({last.name})에서 뺀 짐은 카드에 점선 말뚝으로 표시해 둘게요.
            </Sans>
          ) : null}

          <Button title={paused ? '새로 시작' : '짐 싸기 시작'} variant={paused ? 'outline' : 'primary'} size="lg" onPress={start} />

          <View style={styles.section}>
            <Label size={13} color={c.inkSoft}>지난 캠핑</Label>
            {state.history.length === 0 ? (
              <Sans size={15} color={c.inkSoft}>아직 없어요. 짐을 다 싸고 기록하면 여기에 남아요.</Sans>
            ) : (
              <View>
                {state.history.slice(0, 4).map((h, idx) => (
                  <View
                    key={h.date + idx}
                    style={[styles.histRow, idx > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.control }]}>
                    <Sans size={16} weight="700">{h.name}</Sans>
                    <Sans size={12} weight="500" color={c.muted} style={styles.num}>
                      {fmtDate(h.date)} · {SEASONS[h.season]} {NIGHTS[h.nights]} · 챙김 {h.yes.length} · 뺌 {h.no.length}
                    </Sans>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  body: { width: '100%', maxWidth: 420, alignSelf: 'center', paddingHorizontal: space.xl, paddingTop: space.xl, gap: space.xl },
  field: { gap: space.sm },
  resume: { gap: space.xs, padding: space.lg, borderRadius: radius.card, borderWidth: 1.5 },
  section: { gap: space.sm, marginTop: space.xs },
  input: {
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: -0.3,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    minHeight: 52,
    borderWidth: 1.5,
    borderRadius: radius.control,
  },
  legend: { flexDirection: 'row', flexWrap: 'wrap', columnGap: space.lg, rowGap: space.sm },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  swatch: { width: 14, height: 14, borderRadius: 3, borderWidth: 1.5 },
  num: { fontVariant: ['tabular-nums'] },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: minTouch + 8 },
  rowText: { flex: 1, gap: 0 },
  histRow: { paddingVertical: space.md, gap: 2 },
});
