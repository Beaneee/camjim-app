import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as MediaLibrary from 'expo-media-library';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { FadeInLeft, useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';
import { Band } from '../components/Band';
import { Button } from '../components/Button';
import { ItemMark, PostMarker } from '../components/Marker';
import { Display, Label, Sans } from '../components/Typo';
import {
  buildDeck,
  defaultSeason,
  ITEM_BY_ID,
  itemName,
  NIGHTS,
  shortName,
  SEASONS,
  ZONES,
  type Item,
} from '../data/items';
import { captureFlags } from '../store/capture';
import { useStore, type Result } from '../store';
import { CELL_RATIO, minTouch, radius, space, useTheme } from '../theme';

function fmtDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`;
}

type SaveState = { kind: 'idle' } | { kind: 'saving' } | { kind: 'saved' } | { kind: 'denied' } | { kind: 'error' };

export function PosterScreen() {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const reduced = useReducedMotion();
  const { state, dispatch } = useStore();
  // 화면 캡처용: EXPO_PUBLIC_DEV_SCROLL=end 일 때 맨 아래로 (일반·출시 빌드에서는 비어 있음)
  const scroller = useRef<ScrollView>(null);
  useEffect(() => {
    if (process.env.EXPO_PUBLIC_DEV_SCROLL === 'end' || captureFlags.scroll) setTimeout(() => scroller.current?.scrollToEnd({ animated: false }), 600);
  }, []);
  const trip = state.trip!;
  const sheet = useRef<View>(null);
  const [save, setSave] = useState<SaveState>({ kind: 'idle' });

  const { deck, auto } = useMemo(() => buildDeck(trip, state.force), [trip, state.force]);
  const resOf = (id: string): Result | 'auto' => state.res[id] ?? (auto[id] ? 'auto' : 'no');
  const ids = (r: Result) => deck.filter((it) => state.res[it.id] === r).map((it) => it.id);
  const yes = ids('yes'), laterIds = ids('later'), no = ids('no');
  const autoIds = Object.keys(auto);
  // 아직 안 챙긴 짐이 있으면 '다 챙겼다'고 말하지 않는다 (공유 이미지에도 그대로 들어간다)
  const signOff = laterIds.length ? `출발 전에 ${laterIds.length}개만 더` : '다 챙겼다 가자!';

  const saveImage = async () => {
    setSave({ kind: 'saving' });
    try {
      const perm = await MediaLibrary.requestPermissionsAsync(true);
      if (!perm.granted) { setSave({ kind: 'denied' }); return; }
      const uri = await captureRef(sheet, { format: 'png', quality: 1, result: 'tmpfile' });
      await MediaLibrary.saveToLibraryAsync(uri);
      setSave({ kind: 'saved' });
    } catch {
      setSave({ kind: 'error' });
    }
  };

  const finish = () => {
    dispatch({
      type: 'finish',
      record: { name: trip.name, season: trip.season, nights: trip.nights, date: trip.date, yes, later: laterIds, no, auto: autoIds },
      nextDraft: { name: '', season: defaultSeason(), nights: trip.nights, force: [] },
    });
  };

  return (
    <Animated.View entering={reduced ? undefined : FadeInLeft.duration(360)} style={styles.flex}>
      <Band>
        <Display size={22} color={c.onBand}>{signOff}</Display>
        <Sans size={15} color={c.bandSoft}>
          {trip.name} · {SEASONS[trip.season]} {NIGHTS[trip.nights]}
        </Sans>
      </Band>

      <ScrollView
        ref={scroller}
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + space.xxl }]}
        showsVerticalScrollIndicator={false}>
        {/* ---- 출발 전 확인: 아직 안 챙긴 짐부터 */}
        <View style={styles.section}>
          {laterIds.length === 0 ? (
            <View style={styles.allClear}>
              <MaterialCommunityIcons name="check-circle" size={22} color={c.zones.living.ink} />
              <Display size={17}>빠뜨린 짐 없어요</Display>
            </View>
          ) : (
            <Display size={17}>아직 안 챙긴 짐 {laterIds.length}개</Display>
          )}
          {laterIds.length ? (
            <List
              items={laterIds.map((id) => ITEM_BY_ID[id])}
              note="나중에로 남겨 둔 짐"
              action="챙겼다"
              onAction={(id) => dispatch({ type: 'resolve', id, result: 'yes' })}
            />
          ) : null}
        </View>

        {no.length ? (
          <View style={styles.section}>
            <Label size={13} color={c.inkSoft}>필요 없다고 한 짐 {no.length}개</Label>
            <List
              items={no.map((id) => ITEM_BY_ID[id])}
              action="다시 챙기기"
              onAction={(id) => dispatch({ type: 'resolve', id, result: 'yes' })}
            />
          </View>
        ) : null}

        {autoIds.length ? (
          <View style={styles.section}>
            <Label size={13} color={c.inkSoft}>이번 캠핑에서 뺀 짐 {autoIds.length}개</Label>
            <List
              items={autoIds.map((id) => ITEM_BY_ID[id])}
              noteOf={(id) => auto[id]}
              action="넣기"
              onAction={(id) => dispatch({ type: 'include', id })}
            />
          </View>
        ) : null}

        {/* ---- 공유용 배치도 한 장 */}
        <View
          ref={sheet}
          collapsable={false}
          style={[styles.sheet, { backgroundColor: c.card, shadowColor: c.shadow }]}
          accessibilityLabel={`${trip.name} 짐 배치도. 챙김 ${yes.length}개, 아직 ${laterIds.length}개, 뺀 짐 ${no.length + autoIds.length}개.`}>
          <View style={styles.sheetHead}>
            <Display size={22}>{trip.name}</Display>
            <Sans size={13} color={c.inkSoft} style={styles.num}>
              {SEASONS[trip.season]} {NIGHTS[trip.nights]} · 챙김 {yes.length} · 아직 {laterIds.length} · 뺌 {no.length + autoIds.length}
            </Sans>
          </View>

          {ZONES.map((z) => {
            const inZone = [...deck.filter((it) => it.zone === z.id), ...autoIds.map((id) => ITEM_BY_ID[id]).filter((it) => it.zone === z.id)];
            if (!inZone.length) return null;
            const packed = inZone.filter((it) => resOf(it.id) === 'yes').length;
            const zc = c.zones[z.id];
            return (
              <View key={z.id} style={styles.zone}>
                <View style={styles.zoneHead}>
                  <View style={[styles.swatch, { backgroundColor: zc.fill, borderColor: zc.edge }]} />
                  <Sans size={15} weight="700">{z.name} 구역</Sans>
                  <Sans size={13} color={c.muted} style={styles.num}>{packed} / {inZone.length}</Sans>
                </View>
                <View style={styles.grid}>
                  {inZone.map((it) => <Cell key={it.id} item={it} result={resOf(it.id)} />)}
                </View>
              </View>
            );
          })}

          <View style={styles.sheetFoot}>
            <View style={styles.sheetFootLine}>
              <MaterialCommunityIcons name="car-back" size={20} color={c.ink} />
              <Sans size={15} weight="700">{signOff}</Sans>
            </View>
            <Sans size={12} weight="600" color={c.muted} style={styles.num}>캠짐 · {fmtDate(trip.date)}</Sans>
          </View>
        </View>

        <View style={styles.actions}>
          <Button title={save.kind === 'saving' ? '저장하는 중…' : '이미지로 저장'} icon="download" variant="tonal"
            disabled={save.kind === 'saving'} onPress={saveImage} />
          {save.kind === 'saved' ? <Sans size={13} color={c.inkSoft} style={styles.center}>사진첩에 저장했어요.</Sans> : null}
          {save.kind === 'denied' ? (
            <Sans size={13} color={c.inkSoft} style={styles.center}>사진 저장을 허용해야 저장할 수 있어요. 설정에서 허용한 뒤 다시 눌러 주세요.</Sans>
          ) : null}
          {save.kind === 'error' ? (
            <Sans size={13} color={c.inkSoft} style={styles.center}>저장하지 못했어요. 다시 눌러 주세요.</Sans>
          ) : null}
          <Button title="기록하고 마치기" variant="primary" size="lg" onPress={finish} />
          <Button title="기록 없이 처음으로" variant="text" onPress={() => dispatch({ type: 'discard' })} />
        </View>
      </ScrollView>
    </Animated.View>
  );
}

/** 확인 목록 한 줄: 표식, 이름, 말뚝, 오른쪽 동작 버튼 */
function List({ items, note, noteOf, action, onAction }: {
  items: Item[];
  note?: string;
  noteOf?: (id: string) => string;
  action: string;
  onAction: (id: string) => void;
}) {
  const { c } = useTheme();
  return (
    <View>
      {items.map((it, idx) => (
        <View key={it.id} style={[styles.row, idx > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.control }]}>
          <ItemMark item={it} size="row" />
          <View style={styles.rowText}>
            <Sans size={15} weight="600">{itemName(it)}</Sans>
            {note || noteOf ? <Sans size={12} weight="500" color={c.muted}>{noteOf ? noteOf(it.id) : note}</Sans> : null}
          </View>
          <PostMarker item={it} size="sm" />
          <Button variant="text" title={action} accessibilityLabel={`${itemName(it)} ${action}`} onPress={() => onAction(it.id)} />
        </View>
      ))}
    </View>
  );
}

/** 칸 이름: 두 물건 카드는 '·' 자리에서만 줄을 바꾼다 ("등유통\n소화기") */
function cellName(it: Item) {
  return it.q2 ? `${shortName(it.q)}\n${shortName(it.q2)}` : shortName(it.q);
}

/** 포스터 칸: 트렁크 상자와 같은 7:3 모듈 */
const GRID_GAP = 6;
function useCellSize() {
  const { width } = useWindowDimensions();
  const inner = Math.min(width, 420) - space.xl * 2 - space.lg * 2;
  const w = Math.floor((inner - GRID_GAP * 2) / 3);
  return { width: w, height: Math.round(w / CELL_RATIO) };
}

function Cell({ item, result }: { item: Item; result: Result | 'auto' }) {
  const { c } = useTheme();
  const size = useCellSize();
  const z = c.zones[item.zone];
  const packed = result === 'yes';
  const pending = result === 'later';
  return (
    <View
      style={[
        styles.cell,
        size,
        packed
          ? { backgroundColor: z.fill, borderColor: z.edge }
          : { backgroundColor: c.card, borderColor: pending ? z.ink : c.control, borderStyle: pending ? 'dashed' : 'solid' },
      ]}>
      <ItemMark item={item} size="cell" color={packed ? z.onFill : pending ? z.ink : c.muted} />
      <Sans size={12} weight={packed ? '700' : '500'} color={packed ? z.onFill : pending ? c.ink : c.muted} numberOfLines={2}
        lineBreakStrategyIOS="hangul-word"
        style={[styles.cellText, !packed && !pending && styles.struck]}>
        {cellName(item)}
      </Sans>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  num: { fontVariant: ['tabular-nums'] },
  center: { textAlign: 'center' },
  body: { width: '100%', maxWidth: 420, alignSelf: 'center', paddingHorizontal: space.xl, paddingTop: space.xl, gap: space.xl },
  section: { gap: space.sm },
  allClear: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: minTouch + 8 },
  rowText: { flex: 1 },
  sheet: {
    borderRadius: radius.card,
    padding: space.lg,
    gap: space.lg,
    shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 3,
  },
  sheetHead: { gap: 2 },
  zone: { gap: space.sm },
  zoneHead: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  swatch: { width: 12, height: 12, borderRadius: 3, borderWidth: 1.5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GRID_GAP },
  cell: {
    borderRadius: 6,
    borderWidth: 1.5,
    paddingHorizontal: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cellText: { flex: 1, lineHeight: 15 },
  struck: { textDecorationLine: 'line-through' },
  sheetFoot: { alignItems: 'center', gap: 2, paddingTop: space.xs },
  sheetFootLine: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  actions: { gap: space.sm },
});
