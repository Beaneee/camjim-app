import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { radius, space, useTheme } from '../theme';
import { Sans } from './Typo';

type Props<K extends string> = {
  options: Record<K, string>;
  value: K;
  onChange: (k: K) => void;
};

/** 봄가을 / 여름 / 겨울 같은 한 줄 선택 */
export function Segmented<K extends string>({ options, value, onChange }: Props<K>) {
  const { c } = useTheme();
  return (
    <View style={styles.row}>
      {(Object.keys(options) as K[]).map((k) => {
        const on = k === value;
        return (
          <Pressable
            key={k}
            onPress={() => onChange(k)}
            accessibilityRole="radio"
            accessibilityState={{ selected: on }}
            style={({ pressed }) => [
              styles.seg,
              { backgroundColor: on ? c.oliveSoft : c.card, borderColor: on ? c.olive : c.line },
              pressed && { opacity: 0.8 },
            ]}>
            <Sans size={15} color={on ? c.olive : c.inkSoft} style={{ fontWeight: on ? '700' : '500' }}>
              {options[k]}
            </Sans>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6 },
  seg: { flex: 1, paddingVertical: space.md, alignItems: 'center', borderRadius: radius.button, borderWidth: 1.5 },
});
