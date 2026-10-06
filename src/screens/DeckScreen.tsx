import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Band } from '../components/Band';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Trunk } from '../components/Trunk';
import { Display, Sans } from '../components/Typo';
import {
  buildDeck,
  importanceOf,
  ITEM_BY_ID,
  itemName,
  LATER_SAY,
  NO_SAY,
  pick,
  shortName,
  YES_SAY,
  ZONE_BY_ID,
  zoneSpan,
  type Item,
} from '../data/items';
import { useStore, type Result } from '../store';
import { captureFlags } from '../store/capture';
import { space, useTheme } from '../theme';

const OUT = Easing.bezier(0.22, 1, 0.36, 1);   // 지수형 감속
const IN = Easing.bezier(0.5, 0, 0.9, 0.5);
const HOLD = 700;  // 도장과 한마디를 읽을 시간 (동작 줄이기에서도 유지)
const EXIT = 380;

const STAMP_LABEL: Record<Result, string> = { yes: '챙김', later: '나중에', no: '필요 없어' };

export function DeckScreen() {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  const { state, dispatch } = useStore();
  const { width } = useWindowDimensions();
  const reduced = useReducedMotion();
  const trip = state.trip!;

  const { deck } = useMemo(() => buildDeck(trip, state.force), [trip, state.force]);
  const deckIds = useMemo(() => deck.map((it) => it.id), [deck]);
  const round = state.round;
  const item: Item | undefined =
    round === 'main' ? deck[state.i] : round === 'later' ? ITEM_BY_ID[state.queue[state.j]] : undefined;
  const upcoming: Item[] =
    round === 'main'
      ? deck.slice(state.i + 1, state.i + 3)
      : round === 'later'
        ? state.queue.slice(state.j + 1, state.j + 3).map((id) => ITEM_BY_ID[id])
        : [];
  const finished = round === 'done';

  const last = state.history[0];
  const skippedLast = (id: string) => !!last?.no.includes(id);
  const leftover = deckIds.filter((id) => state.res[id] === 'later').length;
  const packedZones = useMemo(
    () => deckIds.filter((id) => state.res[id] === 'yes').map((id) => ITEM_BY_ID[id].zone),
    [deckIds, state.res],
  );

  // ---- 애니메이션 값 (현재 카드 한 장에만 쓰고, 카드가 바뀔 때 되돌린다)
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const rot = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const shake = useSharedValue(0);
  const stampOpacity = useSharedValue(0);
  const stampScale = useSharedValue(2);
  const sayOpacity = useSharedValue(0);

  const [say, setSay] = useState('');
  const [stamp, setStamp] = useState<Result>('yes');
  const busy = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const later = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  // 동작 줄이기: 움직임은 없애고, 도장·한마디를 읽을 시간은 남긴다
  const d = (ms: number) => (reduced ? 0 : ms);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: tx.value },
      { translateY: ty.value + shake.value },
      { rotate: `${rot.value}deg` },
      { scale: scale.value },
    ],
  }));
  const stampStyle = useAnimatedStyle(() => ({
    opacity: stampOpacity.value,
    transform: [{ rotate: '-10deg' }, { scale: stampScale.value }],
  }));
  const sayStyle = useAnimatedStyle(() => ({ opacity: sayOpacity.value }));

  const resetForNext = useCallback((mode: 'rise' | 'backIn') => {
    stampOpacity.value = 0;
    stampScale.value = 2;
    sayOpacity.value = 0;
    shake.value = 0;
    setSay('');
    if (mode === 'rise') {
      tx.value = 0; rot.value = 0;
      ty.value = reduced ? 0 : 16; scale.value = reduced ? 1 : 0.95; opacity.value = reduced ? 1 : 0.75;
      ty.value = withTiming(0, { duration: d(280), easing: OUT });
      scale.value = withTiming(1, { duration: d(280), easing: OUT });
      opacity.value = withTiming(1, { duration: d(280), easing: OUT });
    } else {
      ty.value = 0; scale.value = 1;
      tx.value = reduced ? 0 : -width * 0.8; rot.value = reduced ? 0 : -8; opacity.value = reduced ? 1 : 0;
      tx.value = withTiming(0, { duration: d(400), easing: OUT });
      rot.value = withTiming(0, { duration: d(400), easing: OUT });
      opacity.value = withTiming(1, { duration: d(400), easing: OUT });
    }
  }, [width, reduced]);

  // 현재 카드가 바뀐 직후(이전 카드는 이미 빠진 상태)에 다음 카드 등장 애니메이션을 시작한다
  const pendingReset = useRef<'rise' | 'backIn' | null>(null);
  const cardKey = item ? item.id + round : 'none';
  useLayoutEffect(() => {
    if (!pendingReset.current) return;
    resetForNext(pendingReset.current);
    pendingReset.current = null;
  }, [cardKey]);

  const act = (kind: Result) => {
    if (busy.current || !item) return;
    busy.current = true;

    // 1) 도장 + 흔들림 + 진동 + 한마디
    setStamp(kind);
    const line =
      kind === 'yes'
        ? skippedLast(item.id) ? '지난번엔 뺐는데, 이번엔 챙기네' : item.say ?? pick(YES_SAY)
        : kind === 'later'
          ? pick(LATER_SAY)
          : skippedLast(item.id) ? '지난번에도 뺐지' : pick(NO_SAY);
    setSay(line);
    AccessibilityInfo.announceForAccessibility(`${itemName(item)}, ${STAMP_LABEL[kind]}. ${line}`);

    stampOpacity.value = withTiming(1, { duration: d(90) });
    stampScale.value = reduced
      ? 1
      : withSequence(
          withTiming(0.92, { duration: 170, easing: Easing.out(Easing.cubic) }),
          withTiming(1, { duration: 110, easing: Easing.out(Easing.quad) }),
        );
    if (!reduced) {
      shake.value = withSequence(withTiming(3, { duration: 90 }), withTiming(-1, { duration: 90 }), withTiming(0, { duration: 90 }));
    }
    sayOpacity.value = withTiming(1, { duration: d(220) });
    Haptics.impactAsync(kind === 'yes' ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light).catch(() => {});

    // 2) 카드 내보내기: 챙김은 트렁크로 떨어지고, 나중에는 위로 비켜 두고, 필요 없어는 왼쪽으로
    later(() => {
      if (reduced) {
        opacity.value = withTiming(0, { duration: 160 });
      } else if (kind === 'yes') {
        ty.value = withTiming(320, { duration: EXIT, easing: IN });
        scale.value = withTiming(0.12, { duration: EXIT, easing: IN });
        rot.value = withTiming(6, { duration: EXIT, easing: IN });
        opacity.value = withTiming(0, { duration: EXIT - 40 });
      } else if (kind === 'later') {
        ty.value = withTiming(-140, { duration: EXIT, easing: IN });
        scale.value = withTiming(0.8, { duration: EXIT, easing: IN });
        opacity.value = withTiming(0, { duration: EXIT - 40 });
      } else {
        tx.value = withTiming(-width * 1.2, { duration: EXIT, easing: IN });
        rot.value = withTiming(-10, { duration: EXIT, easing: IN });
        opacity.value = withTiming(0, { duration: EXIT - 40 });
      }
      later(() => {
        // 애니메이션 값은 새 카드가 화면에 올라온 뒤에 되돌린다 (아래 useLayoutEffect).
        // 여기서 바로 되돌리면 아직 빠지지 않은 이전 카드가 흐릿하게 다시 보인다.
        pendingReset.current = 'rise';
        dispatch({ type: 'answer', id: item.id, result: kind, deckIds });
        busy.current = false;
      }, reduced ? 170 : EXIT);
    }, HOLD);
  };

  const canUndo = !finished && (round === 'later' || state.i > 0);
  const undo = () => {
    if (busy.current || !canUndo) return;
    pendingReset.current = 'backIn';
    dispatch({ type: 'undo', deckIds });
  };

  // ---- 엔딩: 버튼이 빠지고, 차가 가운데로 커진 뒤 문이 닫히고 출발 → 포스터
  const [closed, setClosed] = useState(false);
  const [driving, setDriving] = useState(false);
  useEffect(() => {
    if (!finished) { setClosed(false); setDriving(false); return; }
    busy.current = true;
    if (captureFlags.hold) return; // 캡처 모드: 엔딩 장면(문 열린 트렁크)에서 멈춘다
    later(() => {
      setClosed(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
      later(() => {
        setDriving(true);
        later(() => { busy.current = false; dispatch({ type: 'poster' }); }, reduced ? 400 : 950);
      }, reduced ? 500 : 700);
    }, reduced ? 600 : 650);
  }, [finished]);

  // ---- 안내판 띠: 지금 구역과 그 구역의 처음·끝 짐
  const zone = item ? ZONE_BY_ID[item.zone] : null;
  const span = zone ? zoneSpan(deck, zone.id) : null;
  const total = deck.length;

  return (
    <View style={styles.flex}>
      <Band>
        <View style={styles.bandTop}>
          <Display size={22} color={c.onBand} numberOfLines={1} style={styles.flexShrink}>
            {trip.name}
          </Display>
          <Sans size={17} weight="700" color={c.onBand} style={styles.num} accessibilityLabel={progressLabel()}>
            {progressText()}
          </Sans>
        </View>
        {round === 'later' ? (
          <Sans size={15} weight="600" color={c.bandSoft}>나중에로 넘긴 짐 {state.queue.length}개, 트렁크 닫기 전에 다시 볼게요</Sans>
        ) : zone && span ? (
          <View style={styles.zoneLine}>
            <View style={[styles.zoneSwatch, { backgroundColor: c.zones[zone.id].fill }]} />
            <Sans size={15} weight="700" color={c.onBand}>{zone.name} 구역</Sans>
            <Sans size={15} color={c.bandSoft} numberOfLines={1} style={styles.flexShrink}>
              {span.count > 1 ? `${shortName(span.first.q)} … ${shortName(span.last.q)}` : shortName(span.first.q)}
            </Sans>
          </View>
        ) : (
          <Sans size={15} weight="600" color={c.bandSoft}>트렁크 닫는 중</Sans>
        )}
      </Band>

      <View style={[styles.body, { paddingBottom: insets.bottom + space.sm }]}>
        {finished ? (
          <Animated.View entering={FadeIn.duration(d(300))} style={styles.finale}>
            <Display size={30} style={styles.center}>{leftover ? `${leftover}개 빼고 다 실었다` : '짐 다 실었다!'}</Display>
            <Sans size={15} color={c.inkSoft} style={styles.center}>
              {leftover ? '트렁크 닫고, 남은 짐은 다음 화면에서 볼게요' : '트렁크 닫고 출발할게요'}
            </Sans>
            <Trunk zones={packedZones} total={total} closed={closed} driving={driving} hero />
          </Animated.View>
        ) : (
          <>
            <View style={styles.stage}>
              {upcoming[1] ? (
                <Card key={upcoming[1].id + '-2'} item={upcoming[1]} season={trip.season}
                  importance={importanceOf(upcoming[1], trip.season, skippedLast(upcoming[1].id))} dim="next2" />
              ) : null}
              {upcoming[0] ? (
                <Card key={upcoming[0].id + '-1'} item={upcoming[0]} season={trip.season}
                  importance={importanceOf(upcoming[0], trip.season, skippedLast(upcoming[0].id))} dim="next" />
              ) : null}
              {item ? (
                <Card
                  key={cardKey}
                  item={item}
                  season={trip.season}
                  importance={importanceOf(item, trip.season, skippedLast(item.id))}
                  say={say}
                  stamp={stamp}
                  style={cardStyle}
                  stampStyle={stampStyle}
                  sayStyle={sayStyle}
                />
              ) : null}
            </View>

            <Animated.View exiting={FadeOut.duration(d(200))} style={styles.actions}>
              <View style={styles.secondaryRow}>
                <Button title="나중에" icon="clock-outline" style={styles.flex} onPress={() => act('later')} />
                <Button title="필요 없어" icon="close" style={styles.flex} onPress={() => act('no')} />
              </View>
              <Button title="챙겼다!" icon="check-bold" variant="primary" size="lg" onPress={() => act('yes')} />
              <Button title="이전으로" icon="undo" variant="text" disabled={!canUndo} onPress={undo} />
            </Animated.View>

            <Trunk zones={packedZones} total={total} />
          </>
        )}
      </View>
    </View>
  );

  function progressText() {
    if (round === 'later') return `${state.j + 1} / ${state.queue.length}`;
    return `${Math.min(state.i + 1, total)} / ${total}`;
  }
  function progressLabel() {
    if (round === 'later') return `나중에 넘긴 짐 ${state.queue.length}개 중 ${state.j + 1}번째`;
    return `${total}장 중 ${Math.min(state.i + 1, total)}번째`;
  }
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  flexShrink: { flexShrink: 1 },
  num: { fontVariant: ['tabular-nums'] },
  center: { textAlign: 'center' },
  bandTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.md },
  zoneLine: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  zoneSwatch: { width: 12, height: 12, borderRadius: 3 },
  body: {
    flex: 1,
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    paddingHorizontal: space.xl,
    paddingTop: space.lg,
    gap: space.md,
  },
  stage: { flex: 1, minHeight: 230, marginBottom: 30 },
  actions: { gap: space.sm },
  secondaryRow: { flexDirection: 'row', gap: space.sm },
  finale: { flex: 1, justifyContent: 'center', gap: space.sm },
});
