import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import type { Item, Season } from '../data/items';
import { SEASONS } from '../data/items';
import { radius, useTheme } from '../theme';
import { Pen, Sans } from './Typo';

export type StampKind = 'yes' | 'pass';

type Props = {
  item: Item;
  season: Season;
  lastPassed?: boolean;      // 지난 캠핑에서 패스했던 항목
  say?: string;              // 카드가 하는 말 (도장 찍힌 뒤)
  stamp?: StampKind;         // 도장 종류
  style?: StyleProp<AnimatedStyle<ViewStyle>>;
  stampStyle?: StyleProp<AnimatedStyle<ViewStyle>>;
  sayStyle?: StyleProp<AnimatedStyle<ViewStyle>>;
  dim?: 'next' | 'next2';    // 뒤에 비치는 카드
};

export function Card({ item, season, lastPassed, say, stamp = 'yes', style, stampStyle, sayStyle, dim }: Props) {
  const { c } = useTheme();
  const pri = item.pri === season || item.only === season;
  const stampColor = stamp === 'yes' ? c.stamp : c.stampPass;

  return (
    <Animated.View
      style={[
        styles.card,
        { backgroundColor: c.card, borderColor: c.line, shadowColor: c.shadow },
        dim === 'next' && styles.next,
        dim === 'next2' && styles.next2,
        style,
      ]}>
      <View>
        <Pen size={44} style={styles.q}>{item.q}</Pen>
        {item.q2 ? <Pen size={28} color={c.inkSoft}>{item.q2}</Pen> : null}
      </View>

      {lastPassed ? (
        <View style={[styles.chip, { borderColor: c.line, backgroundColor: c.paper }]}>
          <Sans size={11} color={c.muted} style={styles.chipText}>지난번엔 패스</Sans>
        </View>
      ) : pri ? (
        <View style={[styles.chip, { borderColor: c.olive, backgroundColor: c.oliveSoft }]}>
          <Sans size={11} color={c.olive} style={styles.chipText}>{SEASONS[season]} 필수</Sans>
        </View>
      ) : null}

      <View style={styles.pic}>
        <View style={[styles.frame, { borderColor: c.line }]}>
          <Sans size={88} style={styles.glyph}>{item.glyph}</Sans>
        </View>
      </View>

      <Animated.View style={[styles.sayWrap, sayStyle]}>
        <Pen size={26} color={c.inkSoft} style={styles.say} numberOfLines={1}>{say ?? ' '}</Pen>
      </Animated.View>

      <Animated.View pointerEvents="none" style={[styles.stamp, { borderColor: stampColor }, stampStyle]}>
        <Pen size={50} color={stampColor} style={styles.stampText}>{stamp === 'yes' ? '챙김!' : '패스'}</Pen>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
    borderWidth: 1.5, borderRadius: radius.card,
    paddingHorizontal: 22, paddingTop: 20, paddingBottom: 16,
    overflow: 'hidden',
    shadowOpacity: 0.1, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 6,
  },
  next: { transform: [{ translateY: 24 }, { scale: 0.94 }], opacity: 0.7, shadowOpacity: 0, elevation: 0 },
  next2: { transform: [{ translateY: 44 }, { scale: 0.88 }], opacity: 0.35, shadowOpacity: 0, elevation: 0 },
  q: { maxWidth: 260 },
  chip: { position: 'absolute', top: 18, right: 18, borderWidth: 1, borderRadius: radius.chip, paddingHorizontal: 9, paddingVertical: 3 },
  chipText: { fontWeight: '700', letterSpacing: 0.4, lineHeight: 14 },
  pic: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  frame: { width: 150, height: 150, borderRadius: 75, borderWidth: 1.5, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  glyph: { lineHeight: 104, textAlign: 'center' },
  sayWrap: { minHeight: 30, alignItems: 'center' },
  say: { textAlign: 'center' },
  stamp: {
    position: 'absolute', right: 20, top: 74,
    borderWidth: 4, borderRadius: 10, paddingHorizontal: 14, paddingTop: 6, paddingBottom: 2,
    transform: [{ rotate: '-14deg' }],
  },
  stampText: { lineHeight: 52 },
});

