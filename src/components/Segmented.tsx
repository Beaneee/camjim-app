import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { minTouch, radius, useTheme } from '../theme';
import { Sans } from './Typo';

type Props<K extends string> = {
  label: string; // 화면 낭독기용 그룹 이름 ("계절")
  options: Record<K, string>;
  value: K;
  onChange: (k: K) => void;
};

/**
 * 한 줄 선택. OS마다 표준 모양을 따른다.
 * iOS: 트랙 안에서 흰 칸이 움직이는 분할 컨트롤.
 * Android: Material 3 분할 버튼(외곽선 + 선택 칸 체크 표시).
 */
export function Segmented<K extends string>(props: Props<K>) {
  return Platform.OS === 'android' ? <MaterialSegmented {...props} /> : <IosSegmented {...props} />;
}

function IosSegmented<K extends string>({ label, options, value, onChange }: Props<K>) {
  const { c } = useTheme();
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={label}
      style={[styles.iosTrack, { backgroundColor: c.track, borderColor: c.control }]}>
      {(Object.keys(options) as K[]).map((k) => {
        const on = k === value;
        return (
          <Pressable
            key={k}
            onPress={() => onChange(k)}
            accessibilityRole="radio"
            accessibilityState={{ checked: on }}
            style={({ pressed }) => [
              styles.iosSeg,
              on && [styles.iosThumb, { backgroundColor: c.card, shadowColor: c.shadow }],
              pressed && !on && { opacity: 0.6 },
            ]}>
            <Sans size={15} weight={on ? '700' : '500'} color={on ? c.ink : c.inkSoft}>
              {options[k]}
            </Sans>
          </Pressable>
        );
      })}
    </View>
  );
}

function MaterialSegmented<K extends string>({ label, options, value, onChange }: Props<K>) {
  const { c, isDark } = useTheme();
  const keys = Object.keys(options) as K[];
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={label} style={[styles.mdRow, { borderColor: c.control }]}>
      {keys.map((k, idx) => {
        const on = k === value;
        return (
          <Pressable
            // 물결 효과가 옛 바탕색을 기억하지 않도록 선택·테마가 바뀌면 새로 만든다
            key={`${k}-${on ? 1 : 0}-${isDark ? 'd' : 'l'}`}
            onPress={() => onChange(k)}
            accessibilityRole="radio"
            accessibilityState={{ checked: on }}
            android_ripple={{ color: '#00000014' }}
            style={[
              styles.mdSeg,
              idx > 0 && { borderLeftWidth: 1, borderLeftColor: c.control },
              on && { backgroundColor: c.tonal },
            ]}>
            {on ? <MaterialCommunityIcons name="check" size={18} color={c.onTonal} /> : null}
            <Sans size={14} weight="600" color={on ? c.onTonal : c.ink}>
              {options[k]}
            </Sans>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  iosTrack: {
    flexDirection: 'row',
    borderRadius: radius.control,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 3,
    minHeight: minTouch,
  },
  iosSeg: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: radius.control - 3, minHeight: minTouch - 6 },
  iosThumb: { shadowOpacity: 0.12, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  mdRow: { flexDirection: 'row', borderRadius: radius.pill, borderWidth: 1, overflow: 'hidden', minHeight: 48 },
  mdSeg: { flex: 1, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center', minHeight: 48 },
});
