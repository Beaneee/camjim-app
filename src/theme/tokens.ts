import type { TextStyle } from 'react-native';

/**
 * 캠핑장 안내판 팔레트.
 * 남청 안내판 띠가 뼈대, 바탕은 차분한 중립색, 다섯 구역 색이 분류·진행·도장을 맡는다.
 * 모든 글자 쌍은 4.5:1, 컨트롤 경계는 3:1 이상으로 맞췄다.
 */
export type ZoneId = 'home' | 'kitchen' | 'fire' | 'power' | 'living';

export type ZoneColors = {
  fill: string;   // 말뚝, 트렁크 상자, 포스터 칸의 바탕
  onFill: string; // fill 위 글자
  ink: string;    // 흰 카드 위 글자·도장·아이콘
  edge: string;   // 밝은 바탕 위에서 fill 테두리 (노랑처럼 대비가 약한 색을 위해)
};

export type Palette = {
  band: string;       // 안내판 띠 (화면 위쪽 뼈대)
  onBand: string;     // 띠 위 주 글자
  bandSoft: string;   // 띠 위 보조 글자
  ground: string;     // 화면 바탕
  card: string;       // 카드, 입력칸, 시트
  ink: string;        // 본문
  inkSoft: string;    // 보조 본문
  muted: string;      // 캡션 (12pt 이상에서만)
  control: string;    // 입력칸·선택 버튼 경계
  track: string;      // iOS 분할 선택 트랙
  primary: string;    // 주 버튼
  onPrimary: string;
  tonal: string;      // 보조 버튼·선택된 분할 바탕
  onTonal: string;
  laterInk: string;   // '나중에' 도장
  noInk: string;      // '필요 없어' 도장
  trunkIn: string;    // 트렁크 안
  body: string;       // 차체
  bodyStroke: string; // 차체 선
  taillight: string;  // 후미등 (도장 색과 분리)
  shadow: string;
  zones: Record<ZoneId, ZoneColors>;
};

export const light: Palette = {
  band: '#0E3B43',
  onBand: '#FFFFFF',
  bandSoft: '#B9D3D6',
  ground: '#F3F5F4',
  card: '#FFFFFF',
  ink: '#152221',
  inkSoft: '#3E4D4B',
  muted: '#5C6A68',
  control: '#7C8A87',
  track: '#E3E8E6',
  primary: '#0E3B43',
  onPrimary: '#FFFFFF',
  tonal: '#DCE9EA',
  onTonal: '#0E3B43',
  laterInk: '#0E3B43',
  noInk: '#5C6A68',
  trunkIn: '#1E2B2C',
  body: '#FFFFFF',
  bodyStroke: '#152221',
  taillight: '#D7263D',
  shadow: '#0E1F20',
  zones: {
    home: { fill: '#C2410C', onFill: '#FFFFFF', ink: '#B23A0A', edge: '#C2410C' },
    kitchen: { fill: '#F2B705', onFill: '#152221', ink: '#8A5F00', edge: '#8A5F00' },
    fire: { fill: '#C8102E', onFill: '#FFFFFF', ink: '#B30E29', edge: '#C8102E' },
    power: { fill: '#1F5FD1', onFill: '#FFFFFF', ink: '#1A54BC', edge: '#1F5FD1' },
    living: { fill: '#0F7B5F', onFill: '#FFFFFF', ink: '#0D6E55', edge: '#0F7B5F' },
  },
};

export const dark: Palette = {
  band: '#15444D',
  onBand: '#FFFFFF',
  bandSoft: '#CFE5E7',
  ground: '#0E1514',
  card: '#18211F',
  ink: '#E7EEEC',
  inkSoft: '#B8C4C1',
  muted: '#93A19E',
  control: '#73827F',
  track: '#222D2B',
  primary: '#A9CED2',
  onPrimary: '#0B1F22',
  tonal: '#21393C',
  onTonal: '#CFE5E7',
  laterInk: '#A9CED2',
  noInk: '#93A19E',
  trunkIn: '#0A1010',
  body: '#2A3533',
  bodyStroke: '#93A19E',
  taillight: '#FF5A6A',
  shadow: '#000000',
  zones: {
    home: { fill: '#E05A1F', onFill: '#0E1514', ink: '#FF9461', edge: '#E05A1F' },
    kitchen: { fill: '#F2B705', onFill: '#152221', ink: '#F5C842', edge: '#F2B705' },
    fire: { fill: '#E0283F', onFill: '#FFFFFF', ink: '#FF7A85', edge: '#E0283F' },
    power: { fill: '#2F6BD8', onFill: '#FFFFFF', ink: '#8DB4FF', edge: '#2F6BD8' },
    living: { fill: '#14A07A', onFill: '#0E1514', ink: '#4FD6AE', edge: '#14A07A' },
  },
};

// 폰트는 Pretendard 하나. 굵기마다 파일이 따로라 패밀리 이름도 따로 쓴다.
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

/** 글자 단계. 위계는 굵기와 크기 대비로만 세운다. */
export const type = {
  display: { size: 30, weight: '700' },   // 카드 질문
  title: { size: 22, weight: '700' },     // 화면 제목
  headline: { size: 17, weight: '600' },  // 구역 이름, 섹션 제목
  body: { size: 15, weight: '400' },
  label: { size: 13, weight: '600' },     // 입력 라벨, 버튼 보조
  caption: { size: 12, weight: '500' },   // 메타 정보 (가장 작은 글자)
} as const;

/** 짐 표식(아이콘)은 세 가지 크기로만 쓴다. */
export const markSize = { card: 120, row: 20, cell: 16 } as const;

/** 트렁크 상자와 포스터 칸이 공유하는 칸 모듈 (가로:세로 = 7:3). */
export const CELL_RATIO = 7 / 3;

export const radius = { card: 20, control: 12, marker: 6, pill: 999 };
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, xxxl: 40 };
export const touch = { min: 44, android: 48 };
