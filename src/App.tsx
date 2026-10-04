import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { DeckScreen } from './screens/DeckScreen';
import { PosterScreen } from './screens/PosterScreen';
import { SetupScreen } from './screens/SetupScreen';
import { StoreProvider, useStore } from './store';
import { fontFiles, space, useTheme } from './theme';

function Router() {
  const { state } = useStore();
  if (state.screen === 'deck' && state.trip) return <DeckScreen />;
  if (state.screen === 'poster' && state.trip) return <PosterScreen />;
  return <SetupScreen />;
}

function Shell() {
  const { c, isDark } = useTheme();
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.paper }]}>
      <View style={styles.frame}>
        <Router />
      </View>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts(fontFiles);
  if (fontError) console.warn('[camjim] 폰트를 불러오지 못해 시스템 폰트로 표시합니다:', fontError.message);
  if (!fontsLoaded && !fontError) return null; // 스플래시가 이 사이를 덮는다
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <Shell />
      </StoreProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  // 프로토타입과 같은 폭(최대 420) 가운데 정렬
  frame: { flex: 1, width: '100%', maxWidth: 420, alignSelf: 'center', paddingHorizontal: space.xl, paddingVertical: space.lg },
});
