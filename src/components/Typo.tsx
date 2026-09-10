import React from 'react';
import { StyleSheet, Text, type TextProps } from 'react-native';
import { fonts, useTheme } from '../theme';

type Props = TextProps & { size?: number; color?: string };

/** 손글씨("텐트는?", 제목, 도장) */
export function Pen({ size = 44, color, style, ...rest }: Props) {
  const { c } = useTheme();
  return (
    <Text
      {...rest}
      style={[
        { fontFamily: fonts.pen, fontSize: size, lineHeight: size * 1.05, color: color ?? c.ink },
        style,
      ]}
    />
  );
}

/** 본문 */
export function Sans({ size = 15, color, style, ...rest }: Props) {
  const { c } = useTheme();
  return (
    <Text
      {...rest}
      style={[{ fontSize: size, lineHeight: size * 1.5, color: color ?? c.ink }, styles.sans, style]}
    />
  );
}

/** 작은 라벨 (자간 넓게) */
export function Label({ size = 12, color, style, ...rest }: Props) {
  const { c } = useTheme();
  return (
    <Text
      {...rest}
      style={[
        { fontSize: size, lineHeight: size * 1.4, color: color ?? c.muted, fontWeight: '700', letterSpacing: 0.8 },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  sans: { fontFamily: fonts.sans },
});
