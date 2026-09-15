import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Button } from '../components/Button';
import { Card, type StampKind } from '../components/Card';
import { Pen, Sans } from '../components/Typo';
import { buildDeck, NIGHTS, PASS_SAY, pick, SEASONS, YES_SAY } from '../data/items';
import { useStore } from '../store';
import { space, useTheme } from '../theme';

const OUT = Easing.bezier(0.3, 0.7, 0.3, 1);
const IN = Easing.bezier(0.5, 0, 0.9, 0.5);

export function DeckScreen() {
  const { c } = useTheme();
  const { state, dispatch } = useStore();
  const { width } = useWindowDimensions();
  const reduced = useReducedMotion();
  const trip = state.trip!;

  const { deck } = useMemo(() => buildDeck(trip, state.force), [trip, state.force]);
  const total = deck.length;
  const item = deck[state.i];
  const finished = state.i >= total;
  const last = state.history[0];
  const passedLastTime = (id: string) => !!last?.pass.includes(id);

  const counts = useMemo(() => {
    let yes = 0, pass = 0;
    for (const k in state.res) state.res[k] === 'yes' ? yes++ : pass++;
    return { yes, pass };
  }, [state.res]);

  // ---- 애니메이션 값 (현재 카드 한 장에만 쓰고, 카드가 바뀔 때 되돌린다)
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const rot = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const shake = useSharedValue(0);
  const stampOpacity = useSharedValue(0);
  const stampScale = useSharedValue(2.2);
  const sayOpacity = useSharedValue(0);
  const sayY = useSharedValue(6);

  const [say, setSay] = useState('');
  const [stamp, setStamp] = useState<StampKind>('yes');
  const busy = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const later = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, reduced ? 0 : ms)); };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

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
    transform: [{ rotate: '-14deg' }, { scale: stampScale.value }],
  }));
  const sayStyle = useAnimatedStyle(() => ({
    opacity: sayOpacity.value,
    transform: [{ translateY: sayY.value }],
  }));

  /** 새 카드가 앞으로 올라오는 모양으로 값 되돌리기 */
  const resetForNext = useCallback((mode: 'rise' | 'backIn') => {
    stampOpacity.value = 0;
    stampScale.value = 2.2;
    sayOpacity.value = 0;
    sayY.value = 6;
    shake.value = 0;
    setSay('');
    if (mode === 'rise') {
      tx.value = 0; rot.value = 0;
      ty.value = 24; scale.value = 0.94; opacity.value = 0.7;
      ty.value = withTiming(0, { duration: d(260), easing: OUT });
      scale.value = withTiming(1, { duration: d(260), easing: OUT });
      opacity.value = withTiming(1, { duration: d(260) });
    } else {
      ty.value = 0; scale.value = 1;
      tx.value = -width * 0.8; rot.value = -8; opacity.value = 0;
      tx.value = withTiming(0, { duration: d(400), easing: OUT });
      rot.value = withTiming(0, { duration: d(400), easing: OUT });
      opacity.value = withTiming(1, { duration: d(400) });
    }
  }, [width, reduced]);

  const act = (kind: StampKind) => {
    if (busy.current || !item) return;
    busy.current = true;

    // 1) 도장 쾅 + 흔들림 + 진동 + 한마디
    setStamp(kind);
    const line =
      kind === 'yes'
        ? passedLastTime(item.id) ? '지난번엔 안 챙겼는데, 이번엔 챙기네' : item.say ?? pick(YES_SAY)
        : passedLastTime(item.id) ? '지난번에도 패스했지' : pick(PASS_SAY);
    setSay(line);

    stampOpacity.value = withTiming(1, { duration: d(90) });
    stampScale.value = withSequence(
      withTiming(0.92, { duration: d(170), easing: Easing.out(Easing.cubic) }),
      withTiming(1, { duration: d(110), easing: Easing.out(Easing.quad) }),
    );
    shake.value = withSequence(
      withTiming(3, { duration: d(90) }),
      withTiming(-1, { duration: d(90) }),
      withTiming(0, { duration: d(90) }),
    );
    sayOpacity.value = withTiming(1, { duration: d(250) });
    sayY.value = withTiming(0, { duration: d(250) });
    Haptics.impactAsync(kind === 'yes' ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light).catch(() => {});

    // 2) 카드 날아가기 (챙김: 오른쪽, 패스: 왼쪽) — 4단계에서 챙김은 트렁크로 떨어지게 바꾼다
    later(() => {
      const dir = kind === 'yes' ? 1 : -1;
      tx.value = withTiming(dir * width * 1.2, { duration: d(420), easing: IN });
      rot.value = withTiming(dir * 11, { duration: d(420), easing: IN });
      opacity.value = withTiming(0, { duration: d(380) });

      // 3) 상태 넘기고 다음 카드 올리기
      later(() => {
        dispatch({ type: 'answer', id: item.id, result: kind });
        dispatch({ type: 'advance' });
        resetForNext('rise');
        busy.current = false;
      }, 420);
    }, 800);
  };

  const undo = () => {
    if (busy.current || state.i === 0) return;
    const prev = deck[state.i - 1];
    dispatch({ type: 'undo', id: prev.id });
    resetForNext('backIn');
  };

  const pct = total ? Math.min(state.i, total) / total : 0;

  return (
    <View style={styles.wrap}>
      <View style={styles.top}>
        <View>
          <Pen size={30}>{trip.name}</Pen>
          <Sans size={12} color={c.muted}>{SEASONS[trip.season]} · {NIGHTS[trip.nights]}</Sans>
        </View>
        <Sans size={14} color={c.inkSoft} style={styles.count}>
          <Sans size={14} style={styles.countBold}>{Math.min(state.i + 1, total)}</Sans> / {total}
        </Sans>
      </View>

      <View style={[styles.bar, { backgroundColor: c.line }]}>
        <View style={[styles.barFill, { backgroundColor: c.olive, width: `${Math.round(pct * 100)}%` }]} />
      </View>
      <View style={styles.tally}>
        <View style={styles.tallyItem}><View style={[styles.dot, { backgroundColor: c.olive }]} /><Sans size={12.5} color={c.muted}>챙김 {counts.yes}</Sans></View>
        <View style={styles.tallyItem}><View style={[styles.dot, styles.dotPass, { backgroundColor: c.line, borderColor: c.muted }]} /><Sans size={12.5} color={c.muted}>패스 {counts.pass}</Sans></View>
      </View>

      <View style={styles.stage}>
        {finished ? <Pen size={34} color={c.inkSoft} style={styles.done}>짐 다 실었다!</Pen> : null}
        {deck[state.i + 2] ? <Card key={deck[state.i + 2].id} item={deck[state.i + 2]} season={trip.season} dim="next2" /> : null}
        {deck[state.i + 1] ? <Card key={deck[state.i + 1].id} item={deck[state.i + 1]} season={trip.season} dim="next" /> : null}
        {item ? (
          <Card
            key={item.id}
            item={item}
            season={trip.season}
            lastPassed={passedLastTime(item.id)}
            say={say}
            stamp={stamp}
            style={cardStyle}
            stampStyle={stampStyle}
            sayStyle={sayStyle}
          />
        ) : null}
      </View>

      <View style={styles.actions}>
        <Button title="이번엔 패스" style={styles.pass} disabled={finished} onPress={() => act('pass')} />
        <Button title="챙겼다!" variant="primary" size="lg" style={styles.yes} disabled={finished} onPress={() => act('yes')} />
      </View>
      <Button title="이전으로" variant="link" disabled={state.i === 0 || finished} onPress={undo} />

      {finished ? (
        <Button title="포스터 보기" onPress={() => dispatch({ type: 'poster' })} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, gap: space.lg },
  top: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: space.md },
  count: { fontVariant: ['tabular-nums'], fontWeight: '500' },
  countBold: { fontWeight: '700' },
  bar: { height: 6, borderRadius: 999, overflow: 'hidden', marginTop: -4 },
  barFill: { height: '100%', borderRadius: 999 },
  tally: { flexDirection: 'row', gap: 14, marginTop: -8 },
  tallyItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotPass: { width: 6, height: 6, borderWidth: 1 },
  stage: { height: 320, marginBottom: 30 }, // 뒤 카드가 삐져나올 자리
  done: { position: 'absolute', alignSelf: 'center', top: 140 },
  actions: { flexDirection: 'row', gap: 10 },
  pass: { flex: 1 },
  yes: { flex: 1.6 },
});
