const base = 16;

const colors = {
  primary: '#142A4F',
  primary300: '#6E81A1',
  primary200: '#CCD8EF',
  onPrimary: '#FFFFFF',

  sub01: '#476cec',
  sub01_400: '#476cec',
  sub01_300: '#90a8fa',
  sub01_200: '#e3ebff',
  sub01_100: '#f4f7ff',

  sub02: '#38B0EC',
  sub02_300: '#87D3FA',
  sub02_200: '#D7EFFB',

  gray: '#7A8190',
  gray400: '#7A8190',
  gray300: '#BDC2CE',
  gray200: '#D1D5E0',
  gray100: '#EEEFF3',

  negative: 'rgba(227, 51, 51, 1)',
  negative400: 'rgba(227, 51, 51, 1)',
  negative300: 'rgba(242, 119, 119, 1)',
  negative200: 'rgba(254, 183, 183, 1)',

  white: '#FFFFFF',
  black: '#000000',

  surface: '#FFFFFF',
  onSurface: '#333333',

  background: '#F3F3F3',
  onBackground: '#333333',
};

const normal = {
  dimens: {
    bigMargin: base * 2,
    margin: base * 1,
    gutter: base * 0.5,
    spacing: base * 0.25,
    thin: base * 0.125,
  },
  colors,
  components: {
    button: {
      normal: {
        primary: colors.primary,
        onPrimary: colors.onPrimary,
        gray: colors.gray,
        onGray: colors.white,
        white: colors.white,
        onWhite: colors.black,
        sub01: colors.sub01,
        onSub01: colors.white,
        sub02: colors.sub02,
        onSub02: colors.white,
        negative: colors.negative,
        onNegative: colors.white,
        transparent: 'transparent',
        onTransparent: 'inherit',
      },
      link: {
        primary: 'transparent',
        onPrimary: colors.primary,
        gray: 'transparent',
        onGray: colors.gray,
        white: 'transparent',
        onWhite: colors.white,
        sub01: 'transparent',
        onSub01: colors.sub01,
        sub02: 'transparent',
        onSub02: colors.sub02,
        negative: 'transparent',
        onNegative: colors.negative,
        transparent: 'transparent',
        onTransparent: 'inherit',
      },
    },
  },
};

export default normal;
export type FrismAdminTheme = typeof normal;
