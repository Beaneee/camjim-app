import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { Platform, Pressable, StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import type { IconName } from '../data/items';
import { minTouch, radius, space, useTheme } from '../theme';
import { Sans } from './Typo';

type Variant = 'primary' | 'tonal' | 'outline' | 'text';

type Props = Omit<PressableProps, 'style'> & {
  title: string;
  variant?: Variant;
  size?: 'md' | 'lg';
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
};

/**
 * 주 버튼(primary) 하나, 보조(tonal/outline), 글자 버튼(text).
 * 모든 버튼은 OS 최소 터치 크기(iOS 44 / Android 48) 이상이다.
 */
export function Button({ title, variant = 'outline', size = 'md', icon, style, disabled, ...rest }: Props) {
  const { c, isDark } = useTheme();
  const fg =
    variant === 'primary' ? c.onPrimary : variant === 'tonal' ? c.onTonal : variant === 'text' ? c.primary : c.ink;
  const bg = variant === 'primary' ? c.primary : variant === 'tonal' ? c.tonal : 'transparent';
  const height = size === 'lg' ? 56 : Math.max(minTouch, 48);
  return (
    <Pressable
      // Android 물결 효과는 만들어질 때의 바탕색을 기억한다. 앱이 켜진 채 다크 모드가 바뀌면
      // 옛 바탕색이 남아 글자가 안 보이므로, 테마가 바뀔 때 새로 만든다.
      key={`${variant}-${isDark ? 'd' : 'l'}`}
      {...rest}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      android_ripple={{ color: variant === 'primary' ? '#ffffff33' : '#00000014', borderless: false }}
      style={({ pressed }) => [
        styles.base,
        { minHeight: variant === 'text' ? minTouch : height, backgroundColor: bg },
        (variant === 'outline' || variant === 'tonal') && { borderWidth: 1.5, borderColor: c.control },
        variant === 'text' && styles.text,
        pressed && !disabled && Platform.OS === 'ios' && { opacity: 0.7 },
        disabled && styles.disabled,
        style,
      ]}>
      {icon ? <MaterialCommunityIcons name={icon} size={size === 'lg' ? 22 : 20} color={fg} /> : null}
      <Sans size={size === 'lg' ? 17 : 15} weight={variant === 'text' ? '600' : '700'} color={fg}>
        {title}
      </Sans>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    gap: space.sm,
    paddingHorizontal: space.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.control,
    overflow: 'hidden',
  },
  text: { alignSelf: 'center', paddingHorizontal: space.md },
  disabled: { opacity: 0.4 },
});
