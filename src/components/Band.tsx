import React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { space, useTheme } from '../theme';

/**
 * 안내판 띠. 모든 화면 위쪽의 남청 뼈대이며 상태 표시줄 아래까지 칠한다.
 * 내용은 앱 본문과 같은 폭(최대 420) 안에 놓인다.
 */
export function Band({ children, style, ...rest }: ViewProps) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View {...rest} style={[{ backgroundColor: c.band, paddingTop: insets.top + space.md }, styles.band]}>
      <View style={[styles.inner, style]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  band: { paddingBottom: space.lg },
  inner: { width: '100%', maxWidth: 420, alignSelf: 'center', paddingHorizontal: space.xl, gap: space.xs },
});
