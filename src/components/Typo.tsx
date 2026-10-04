import React from 'react';
import { StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';
import { familyFor, useTheme } from '../theme';

type Props = TextProps & { size?: number; color?: string; weight?: TextStyle['fontWeight'] };

/**
 * style에 들어온 fontWeight를 Pretendard 패밀리로 바꾸고 fontWeight는 지운다.
 * (커스텀 폰트에 fontWeight가 남아 있으면 iOS가 가짜 굵게를 입히거나 Android가 무시한다)
 */
function resolve(base: TextStyle, style: TextProps['style'], fallbackWeight: TextStyle['fontWeight']) {
  const flat = (StyleSheet.flatten(style) ?? {}) as TextStyle;
  const { fontWeight, ...rest } = flat;
  return [base, rest, { fontFamily: rest.fontFamily ?? familyFor(fontWeight ?? fallbackWeight) }];
}

/** 제목, 카드 질문("텐트는?"), 도장 — 굵고 자간 살짝 좁게 */
export function Display({ size = 30, color, weight = '700', style, ...rest }: Props) {
  const { c } = useTheme();
  return (
    <Text
      {...rest}
      style={resolve(
        { fontSize: size, lineHeight: Math.round(size * 1.25), letterSpacing: -size * 0.02, color: color ?? c.ink },
        style,
        weight,
      )}
    />
  );
}

/** 본문 */
export function Sans({ size = 15, color, weight = '400', style, ...rest }: Props) {
  const { c } = useTheme();
  return (
    <Text
      {...rest}
      style={resolve(
        { fontSize: size, lineHeight: Math.round(size * 1.5), letterSpacing: -size * 0.01, color: color ?? c.ink },
        style,
        weight,
      )}
    />
  );
}

/** 작은 라벨 (자간 넓게) */
export function Label({ size = 12, color, weight = '700', style, ...rest }: Props) {
  const { c } = useTheme();
  return (
    <Text
      {...rest}
      style={resolve(
        { fontSize: size, lineHeight: Math.round(size * 1.4), letterSpacing: 0.6, color: color ?? c.muted },
        style,
        weight,
      )}
    />
  );
}
