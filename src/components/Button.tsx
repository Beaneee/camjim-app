import React from 'react';
import { Pressable, StyleSheet, type PressableProps, type ViewStyle } from 'react-native';
import { radius, useTheme } from '../theme';
import { Sans } from './Typo';

type Props = Omit<PressableProps, 'style'> & {
  title: string;
  variant?: 'primary' | 'ghost' | 'link';
  size?: 'md' | 'lg';
  style?: ViewStyle;
};

export function Button({ title, variant = 'ghost', size = 'md', style, disabled, ...rest }: Props) {
  const { c } = useTheme();
  const primary = variant === 'primary';
  const link = variant === 'link';
  return (
    <Pressable
      {...rest}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        link ? styles.link : { backgroundColor: primary ? c.olive : c.card, borderColor: primary ? c.olive : c.line },
        pressed && !disabled && { transform: [{ scale: 0.97 }], opacity: 0.92 },
        disabled && styles.disabled,
        style,
      ]}>
      <Sans
        size={link ? 13 : size === 'lg' ? 18 : 16}
        color={primary ? c.oliveInk : link ? c.muted : c.inkSoft}
        style={[styles.text, link && styles.linkText]}>
        {title}
      </Sans>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { paddingVertical: 15, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center', borderRadius: radius.button, borderWidth: 1.5 },
  link: { borderWidth: 0, paddingVertical: 6, alignSelf: 'center' },
  text: { fontWeight: '700' },
  linkText: { fontWeight: '500', textDecorationLine: 'underline' },
  disabled: { opacity: 0.35 },
});
