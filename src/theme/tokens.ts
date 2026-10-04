import type { TextStyle } from 'react-native';
// 프로토타입(HTML v2)에서 가져온 색 토큰. 라이트/다크 두 벌.
export type Palette = {
  paper: string;      // 화면 바닥
  card: string;       // 카드, 입력창
  ink: string;        // 본문 글자
  inkSoft: string;    // 보조 글자
  muted: string;      // 힌트, 캡션
  line: string;       // 테두리, 진행 바 바닥
  olive: string;      // 주 색(챙겼다 버튼, 진행)
  oliveInk: string;   // olive 위 글자
  oliveSoft: string;  // olive 연한 배경
  stamp: string;      // 도장 빨강
  stampPass: string;  // 패스 도장 회색
  trunkIn: string;    // 트렁크 내부
  shadow: string;     // 그림자 색
};

export const light: Palette = {
  paper: '#f3f4ec',
  card: '#fffffb',
  ink: '#26291f',
  inkSoft: '#5a5e4f',
  muted: '#8b8f7e',
  line: '#d9dccc',
  olive: '#5c6b3c',
  oliveInk: '#ffffff',
  oliveSoft: '#e6ead8',
  stamp: '#c93a2e',
  stampPass: '#8b8f7e',
  trunkIn: '#3a3f30',
  shadow: '#26291f',
};

export const dark: Palette = {
  paper: '#1b1d16',
  card: '#262a1f',
  ink: '#e8e9dc',
  inkSoft: '#b6b9a8',
  muted: '#858978',
  line: '#3a3f30',
  olive: '#8a9c5c',
  oliveInk: '#161810',
  oliveSoft: '#2f3625',
  stamp: '#e2544a',
  stampPass: '#9a9e8c',
  trunkIn: '#101209',
  shadow: '#000000',
};

// 트렁크에 쌓이는 짐 상자 색. 어두운 트렁크 내부 위라 테마와 무관.
export const boxColors = ['#8a9c5c', '#c9a66b', '#b8654a', '#7d8fa3', '#a58b6f', '#6f8d8a'];

// 폰트는 Pretendard 하나로 통일. 굵기마다 파일이 따로라 패밀리 이름도 따로 쓴다.
// (커스텀 폰트에서는 fontWeight로 굵기를 고를 수 없어서, 굵기 → 패밀리로 바꿔 준다)
export const fonts = {
  regular: 'Pretendard-Regular',
  medium: 'Pretendard-Medium',
  semibold: 'Pretendard-SemiBold',
  bold: 'Pretendard-Bold',
  extrabold: 'Pretendard-ExtraBold',
} as const;

export const fontFiles = {
  [fonts.regular]: require('../../assets/fonts/Pretendard-Regular.otf'),
  [fonts.medium]: require('../../assets/fonts/Pretendard-Medium.otf'),
  [fonts.semibold]: require('../../assets/fonts/Pretendard-SemiBold.otf'),
  [fonts.bold]: require('../../assets/fonts/Pretendard-Bold.otf'),
  [fonts.extrabold]: require('../../assets/fonts/Pretendard-ExtraBold.otf'),
};

const NAMED: Record<string, number> = {
  ultralight: 200, thin: 100, light: 300, normal: 400, regular: 400,
  medium: 500, semibold: 600, condensedBold: 700, bold: 700, heavy: 800, black: 900, condensed: 400,
};

/** fontWeight 값을 Pretendard 패밀리 이름으로 */
export function familyFor(weight: TextStyle['fontWeight']): string {
  const w = weight == null ? 400 : typeof weight === 'number' ? weight : NAMED[weight] ?? Number(weight);
  if (w >= 800) return fonts.extrabold;
  if (w >= 700) return fonts.bold;
  if (w >= 600) return fonts.semibold;
  if (w >= 500) return fonts.medium;
  return fonts.regular;
}

export const radius = { card: 22, button: 14, chip: 999 };
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28 };
