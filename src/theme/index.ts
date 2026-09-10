import { useColorScheme } from 'react-native';
import { dark, light, type Palette } from './tokens';

export { boxColors, fonts, radius, space } from './tokens';
export type { Palette } from './tokens';

export function useTheme(): { c: Palette; isDark: boolean } {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  return { c: isDark ? dark : light, isDark };
}
