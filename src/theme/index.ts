import { Platform, useColorScheme } from 'react-native';
import { dark, light, type Palette, type ZoneId } from './tokens';

export { CELL_RATIO, familyFor, fontFiles, fonts, markSize, radius, space, touch, type } from './tokens';
export type { Palette, ZoneColors, ZoneId } from './tokens';

export function useTheme(): { c: Palette; isDark: boolean } {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  return { c: isDark ? dark : light, isDark };
}

export function useZone(zone: ZoneId) {
  return useTheme().c.zones[zone];
}

/** 각 OS 최소 터치 크기: iOS 44pt, Android 48dp */
export const minTouch = Platform.OS === 'android' ? 48 : 44;
