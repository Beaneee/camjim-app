import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DeckScreen } from './screens/DeckScreen';
import { PosterScreen } from './screens/PosterScreen';
import { SetupScreen } from './screens/SetupScreen';
import { StoreProvider, useStore } from './store';
import { fontFiles, useTheme } from './theme';

function Router() {
  const { state, captureKey } = useStore();
  if (state.screen === 'deck' && state.trip) return <DeckScreen key={captureKey} />;
  if (state.screen === 'poster' && state.trip) return <PosterScreen key={captureKey} />;
  return <SetupScreen key={captureKey} />;
}

function Shell() {
  const { c } = useTheme();
  return (
    <View style={[styles.root, { backgroundColor: c.ground }]}>
      <Router />
      {/* 모든 화면 위쪽이 남청 안내판 띠라 상태 표시줄 글자는 항상 밝게 */}
      <StatusBar style="light" />
    </View>
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
  root: { flex: 1 },
});
