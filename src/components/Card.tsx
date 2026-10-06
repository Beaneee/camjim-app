import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import type { Importance, Item, Season } from '../data/items';
import { SEASONS } from '../data/items';
import type { Result } from '../store';
import { radius, space, useTheme } from '../theme';
import { ItemMark, PostMarker } from './Marker';
import { Display, Sans } from './Typo';

type Props = {
  item: Item;
  season: Season;
  importance: Importance;
  say?: string;               // 도장 뒤 카드가 하는 말
  stamp?: Result;             // 찍힌 도장 종류
  style?: StyleProp<AnimatedStyle<ViewStyle>>;
  stampStyle?: StyleProp<AnimatedStyle<ViewStyle>>;
  sayStyle?: StyleProp<AnimatedStyle<ViewStyle>>;
  dim?: 'next' | 'next2';     // 뒤에 비치는 카드 (화면 낭독기에서는 숨김)
};

const STAMP_TEXT: Record<Result, string> = { yes: '챙김!', later: '나중에', no: '필요 없어' };

export function Card({ item, season, importance, say, stamp = 'yes', style, stampStyle, sayStyle, dim }: Props) {
  const { c } = useTheme();
  const z = c.zones[item.zone];
  const stampColor = stamp === 'yes' ? z.ink : stamp === 'later' ? c.laterInk : c.noInk;
  const note =
    importance === 'must' ? `${SEASONS[season]} 필수` : importance === 'skippedLast' ? '지난번엔 뺐어요' : null;

  return (
    <Animated.View
      accessibilityElementsHidden={!!dim}
      importantForAccessibility={dim ? 'no-hide-descendants' : 'auto'}
      style={[
        styles.card,
        { backgroundColor: c.card, shadowColor: c.shadow },
        dim === 'next' && styles.next,
        dim === 'next2' && styles.next2,
        style,
      ]}>
      <View style={styles.head}>
        <PostMarker item={item} importance={importance} size="plaque" />
        <View style={styles.headText}>
          {note ? (
            <Sans size={13} weight="600" color={importance === 'must' ? z.ink : c.muted}>
              {note}
            </Sans>
          ) : null}
        </View>
      </View>

      <View accessible accessibilityRole="header" style={styles.q}>
        <Display size={30}>{item.q}</Display>
        {item.q2 ? (
          <Display size={20} weight="600" color={c.inkSoft}>
            {item.q2}
          </Display>
        ) : null}
      </View>

      <View style={styles.pic} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <ItemMark item={item} size="card" />
      </View>

      <Animated.View style={[styles.sayWrap, sayStyle]}>
        <Sans size={16} weight="500" color={c.inkSoft} style={styles.say} numberOfLines={2}>
          {say ?? ''}
        </Sans>
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={[styles.stamp, { borderColor: stampColor }, stampStyle]}>
        <Display size={26} weight="800" color={stampColor} style={styles.stampText}>
          {STAMP_TEXT[stamp]}
        </Display>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
    borderRadius: radius.card,
    paddingHorizontal: space.xl, paddingTop: space.lg, paddingBottom: space.lg,
    gap: space.md,
    overflow: 'hidden',
    shadowOpacity: 0.1, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 5,
  },
  next: { transform: [{ translateY: 16 }, { scale: 0.95 }], opacity: 0.75, shadowOpacity: 0, elevation: 0 },
  next2: { transform: [{ translateY: 30 }, { scale: 0.9 }], opacity: 0.4, shadowOpacity: 0, elevation: 0 },
  head: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  headText: { gap: 0 },
  q: { gap: 2 },
  pic: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 96 },
  sayWrap: { minHeight: 24, alignItems: 'center' },
  say: { textAlign: 'center' },
  stamp: {
    position: 'absolute', right: space.lg, top: space.lg,
    borderWidth: 3, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 2,
    transform: [{ rotate: '-10deg' }],
  },
  stampText: { lineHeight: 34 },
});
