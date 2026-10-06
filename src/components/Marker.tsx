import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { Importance, Item } from '../data/items';
import { markSize, radius, useTheme } from '../theme';
import { Sans } from './Typo';

/**
 * 말뚝 번호 ("B-3"). 이 앱의 유일한 장식이다.
 * 중요도는 칩 대신 말뚝의 채움 한 가지 규칙으로만 말한다:
 *   계절 필수 = 꽉 찬 구역 색 / 일반 = 구역 색 외곽선 / 지난번에 뺀 짐 = 점선 외곽선
 */
export function PostMarker({ item, importance = 'normal', size = 'md' }: { item: Item; importance?: Importance; size?: 'sm' | 'md' | 'plaque' }) {
  const { c } = useTheme();
  const z = c.zones[item.zone];
  const solid = importance === 'must';
  const sm = size === 'sm';
  const plaque = size === 'plaque';
  return (
    <View
      style={[
        styles.marker,
        sm && styles.markerSm,
        plaque && styles.markerPlaque,
        solid
          ? { backgroundColor: z.fill, borderColor: z.edge }
          : { backgroundColor: c.card, borderColor: importance === 'skippedLast' ? c.control : z.ink },
        importance === 'skippedLast' && { borderStyle: 'dashed' },
      ]}>
      <Sans
        size={plaque ? 22 : sm ? 12 : 13}
        weight="800"
        color={solid ? z.onFill : importance === 'skippedLast' ? c.muted : z.ink}
        style={[styles.code, plaque && styles.codePlaque]}>
        {item.post}
      </Sans>
    </View>
  );
}

/** 짐 표식. 카드·목록·포스터 칸의 세 가지 고정 크기로만 쓴다. */
export function ItemMark({ item, size, color }: { item: Item; size: keyof typeof markSize; color?: string }) {
  const { c } = useTheme();
  return <MaterialCommunityIcons name={item.icon} size={markSize[size]} color={color ?? c.zones[item.zone].ink} />;
}

const styles = StyleSheet.create({
  marker: {
    borderWidth: 2,
    borderRadius: radius.marker,
    paddingHorizontal: 8,
    minWidth: 46,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerSm: { minWidth: 38, height: 24, paddingHorizontal: 6, borderWidth: 1.5 },
  // 카드 위 말뚝: 캠핑장 사이트 번호판 크기
  markerPlaque: { minWidth: 76, height: 46, paddingHorizontal: 12, borderWidth: 3, borderRadius: 8 },
  code: { fontVariant: ['tabular-nums'], lineHeight: 16 },
  codePlaque: { lineHeight: 26, letterSpacing: 0.2 },
});
