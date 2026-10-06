import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedProps,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { G, Line, Path, Rect, type GProps } from 'react-native-svg';
import type { ZoneId } from '../theme';
import { CELL_RATIO, useTheme } from '../theme';
import { Sans } from './Typo';

const AG = Animated.createAnimatedComponent(G);
const ARect = Animated.createAnimatedComponent(Rect);

// 트렁크 안 짐 상자 격자: 6열 × 5행 = 30칸, 아래부터 채운다.
// 상자는 포스터 칸과 같은 7:3 모듈이다.
const COLS = 6, BOX_W = 27, BOX_H = BOX_W / CELL_RATIO, GAP_X = 29.5, GAP_Y = BOX_H + 1.6, X0 = 92, Y0 = 134 - BOX_H - 2;
const HINGE_Y = 70;      // 트렁크 문 경첩
const LID_OPEN = -0.9;   // 열린 문: 지붕 위로 들려 올라간 해치

type Props = {
  zones: ZoneId[];       // 실은 짐의 구역 (실은 순서대로)
  total: number;
  closed?: boolean;
  driving?: boolean;
  hero?: boolean;        // 엔딩에서 크게
};

export function Trunk({ zones, total, closed = false, driving = false, hero = false }: Props) {
  const { c } = useTheme();
  const reduced = useReducedMotion();
  const d = (ms: number) => (reduced ? 0 : ms);
  const yes = zones.length;

  // 문: 열림(LID_OPEN) → 닫힘(1). 열려 있을 때는 문 안쪽(어두운 면)이 보인다.
  const lid = useSharedValue(LID_OPEN);
  useEffect(() => {
    lid.value = withTiming(closed ? 1 : LID_OPEN, { duration: d(560), easing: Easing.bezier(0.4, 0, 0.2, 1) });
  }, [closed]);
  // 변환은 숫자 행렬로 넘긴다 (문자열 transform은 Android 네이티브 SVG가 애니메이션 중에 받지 못한다).
  // translate(0,H) · scale(1,s) · translate(0,-H) = [1, 0, 0, s, 0, H(1 - s)]
  // matrix는 네이티브 SVG 속성이라 타입에 없어서 GProps로 맞춘다.
  const lidProps = useAnimatedProps(
    () => ({ matrix: [1, 0, 0, lid.value, 0, HINGE_Y * (1 - lid.value)] }) as unknown as Partial<GProps>,
  );
  const lidInnerProps = useAnimatedProps(() => ({ opacity: interpolate(lid.value, [LID_OPEN, 0], [1, 0], 'clamp') }));

  const drive = useSharedValue(0);
  useEffect(() => {
    drive.value = withTiming(driving ? 480 : 0, { duration: d(900), easing: Easing.bezier(0.55, 0, 0.85, 0.4) });
  }, [driving]);
  const carProps = useAnimatedProps(() => ({ matrix: [1, 0, 0, 1, drive.value, 0] }) as unknown as Partial<GProps>);

  // 방금 실은 상자는 위에서 툭 떨어진다
  const drop = useSharedValue(1);
  useEffect(() => {
    if (yes <= 0) return;
    drop.value = 0;
    drop.value = withTiming(1, { duration: d(360), easing: Easing.bezier(0.3, 1.4, 0.5, 1) });
  }, [yes]);
  const lastIdx = yes - 1;
  const lastR = Math.floor(lastIdx / COLS), lastC = lastIdx % COLS;
  const lastProps = useAnimatedProps(() => ({
    y: Y0 - lastR * GAP_Y - (1 - drop.value) * 40,
    opacity: drop.value,
  }));

  const box = (n: number, zone: ZoneId) => ({
    x: X0 + (n % COLS) * GAP_X,
    width: BOX_W,
    height: BOX_H,
    rx: 2,
    fill: c.zones[zone].fill,
    stroke: c.card,
    strokeWidth: 1,
  });

  return (
    <View style={styles.wrap}>
      {!hero ? (
        <View style={styles.cap}>
          <Sans size={12} weight="600" color={c.muted}>트렁크</Sans>
          <Sans size={12} weight="500" color={c.muted} style={styles.num}>{yes}개 실음</Sans>
        </View>
      ) : null}
      <Svg
        width="100%"
        height={hero ? 210 : 104}
        viewBox="0 0 360 160"
        preserveAspectRatio="xMidYMax meet"
        accessibilityLabel={`트렁크에 짐 ${yes}개를 실었어요. 카드는 ${total}장이에요.`}>
        <Line x1={0} y1={152} x2={360} y2={152} stroke={c.control} strokeWidth={2} />
        <AG animatedProps={carProps}>
          <Rect x={60} y={128} width={36} height={24} rx={6} fill={c.bodyStroke} />
          <Rect x={264} y={128} width={36} height={24} rx={6} fill={c.bodyStroke} />
          <Path d="M74 66 L92 30 H268 L286 66 Z" fill={c.body} stroke={c.bodyStroke} strokeWidth={2} strokeLinejoin="round" />
          <Path d="M100 38 H260 L270 60 H90 Z" fill={c.track} />
          <Rect x={40} y={64} width={280} height={78} rx={14} fill={c.body} stroke={c.bodyStroke} strokeWidth={2} />
          <Rect x={90} y={HINGE_Y} width={180} height={64} rx={6} fill={c.trunkIn} />
          <G>
            {zones.slice(0, Math.max(0, yes - 1)).slice(0, COLS * 5).map((zone, n) => (
              <Rect key={n} {...box(n, zone)} y={Y0 - Math.floor(n / COLS) * GAP_Y} />
            ))}
          </G>
          {yes > 0 && lastIdx < COLS * 5 ? (
            <ARect animatedProps={lastProps} {...box(lastIdx, zones[lastIdx])} x={X0 + lastC * GAP_X} />
          ) : null}
          {/* 열린 해치를 받치는 가스 지지대 (열려 있을 때만) */}
          <AG animatedProps={lidInnerProps}>
            <Line x1={100} y1={74} x2={108} y2={22} stroke={c.bodyStroke} strokeWidth={2} strokeLinecap="round" />
            <Line x1={260} y1={74} x2={252} y2={22} stroke={c.bodyStroke} strokeWidth={2} strokeLinecap="round" />
          </AG>
          {/* 트렁크 문: 바깥 면 + 열렸을 때 보이는 안쪽 면 */}
          <AG animatedProps={lidProps}>
            <Rect x={90} y={HINGE_Y} width={180} height={64} rx={6} fill={c.body} stroke={c.bodyStroke} strokeWidth={2} />
            <AG animatedProps={lidInnerProps}>
              <Rect x={96} y={HINGE_Y + 6} width={168} height={52} rx={4} fill={c.trunkIn} opacity={0.85} />
            </AG>
          </AG>
          <Rect x={46} y={98} width={24} height={12} rx={3} fill={c.taillight} />
          <Rect x={290} y={98} width={24} height={12} rx={3} fill={c.taillight} />
        </AG>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 2 },
  cap: { flexDirection: 'row', justifyContent: 'space-between' },
  num: { fontVariant: ['tabular-nums'] },
});
