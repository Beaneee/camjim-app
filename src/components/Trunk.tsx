import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedProps, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { G, Line, Path, Rect } from 'react-native-svg';
import { boxColors, useTheme } from '../theme';
import { Sans } from './Typo';

const AG = Animated.createAnimatedComponent(G);
const ARect = Animated.createAnimatedComponent(Rect);

// 트렁크 안 짐 상자 격자: 6열 × 5행 = 30칸, 아래부터 채운다
const COLS = 6, BOX_W = 28, BOX_H = 11, GAP_X = 30, GAP_Y = 13, X0 = 91, Y0 = 123;
const HINGE_Y = 70; // 트렁크 문 경첩 (열림/닫힘 기준선)
const LID_OPEN = -0.42; // 열린 문은 경첩 위로 접혀 올라간 모양(세로 뒤집기 + 축소)

type Props = {
  yes: number;        // 실은 짐 수
  total: number;      // 카드 수
  closed?: boolean;   // 트렁크 문 닫기
  driving?: boolean;  // 출발
  height?: number;
};

export function Trunk({ yes, total, closed = false, driving = false, height = 130 }: Props) {
  const { c } = useTheme();
  const reduced = useReducedMotion();
  const d = (ms: number) => (reduced ? 0 : ms);

  // 문: -0.42(열림) → 1(닫힘)
  const lid = useSharedValue(LID_OPEN);
  useEffect(() => {
    lid.value = withTiming(closed ? 1 : LID_OPEN, { duration: d(550), easing: Easing.bezier(0.4, 0, 0.2, 1) });
  }, [closed]);
  const lidProps = useAnimatedProps(() => ({
    transform: `translate(0 ${HINGE_Y}) scale(1 ${lid.value}) translate(0 ${-HINGE_Y})`,
  }));

  // 차: 오른쪽으로 출발
  const drive = useSharedValue(0);
  useEffect(() => {
    drive.value = withTiming(driving ? 460 : 0, { duration: d(900), easing: Easing.bezier(0.55, 0, 0.85, 0.4) });
  }, [driving]);
  const carProps = useAnimatedProps(() => ({ transform: `translate(${drive.value} 0)` }));

  // 방금 실은 상자: 위에서 툭 떨어진다
  const drop = useSharedValue(1);
  useEffect(() => {
    if (yes <= 0) return;
    drop.value = 0;
    drop.value = withTiming(1, { duration: d(350), easing: Easing.bezier(0.3, 1.4, 0.5, 1) });
  }, [yes]);
  const lastIdx = yes - 1;
  const lastR = Math.floor(lastIdx / COLS), lastC = lastIdx % COLS;
  const lastProps = useAnimatedProps(() => ({
    y: Y0 - lastR * GAP_Y - (1 - drop.value) * 40,
    opacity: drop.value,
  }));

  const boxes = [];
  for (let n = 0; n < yes - 1 && n < COLS * 5; n++) {
    const r = Math.floor(n / COLS), col = n % COLS;
    boxes.push(<Rect key={n} x={X0 + col * GAP_X} y={Y0 - r * GAP_Y} width={BOX_W} height={BOX_H} rx={2.5} fill={boxColors[n % boxColors.length]} />);
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.cap}>
        <Sans size={12} color={c.muted}>트렁크</Sans>
        <Sans size={12} color={c.muted} style={styles.num}>{yes} / {total} 실었다</Sans>
      </View>
      <Svg width="100%" height={height} viewBox="0 0 360 160" preserveAspectRatio="xMidYMax meet">
        <Line x1={0} y1={152} x2={360} y2={152} stroke={c.line} strokeWidth={2} />
        <AG animatedProps={carProps}>
          {/* 바퀴 */}
          <Rect x={60} y={128} width={36} height={24} rx={6} fill={c.inkSoft} />
          <Rect x={264} y={128} width={36} height={24} rx={6} fill={c.inkSoft} />
          {/* 지붕과 뒷유리 */}
          <Path d="M74 66 L92 30 H268 L286 66 Z" fill={c.card} stroke={c.ink} strokeWidth={2} strokeLinejoin="round" />
          <Path d="M100 38 H260 L270 60 H90 Z" fill={c.line} opacity={0.6} />
          {/* 차체 */}
          <Rect x={40} y={64} width={280} height={78} rx={14} fill={c.card} stroke={c.ink} strokeWidth={2} />
          {/* 트렁크 안 */}
          <Rect x={90} y={HINGE_Y} width={180} height={64} rx={6} fill={c.trunkIn} />
          <G>{boxes}</G>
          {yes > 0 && lastIdx < COLS * 5 ? (
            <ARect animatedProps={lastProps} x={X0 + lastC * GAP_X} width={BOX_W} height={BOX_H} rx={2.5} fill={boxColors[lastIdx % boxColors.length]} />
          ) : null}
          {/* 트렁크 문 */}
          <AG animatedProps={lidProps}>
            <Rect x={90} y={HINGE_Y} width={180} height={64} rx={6} fill={c.card} stroke={c.ink} strokeWidth={2} />
          </AG>
          {/* 후미등 */}
          <Rect x={46} y={98} width={24} height={12} rx={3} fill={c.stamp} />
          <Rect x={290} y={98} width={24} height={12} rx={3} fill={c.stamp} />
        </AG>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 'auto' },
  cap: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  num: { fontVariant: ['tabular-nums'] },
});
