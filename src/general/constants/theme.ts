import { DefaultTheme, Theme } from 'exoflex';
import { COLORS } from './colors';

export const ColorTheme = {
  ...DefaultTheme.colors,
  primary: COLORS.primaryColor,
};

export const CustomTheme: Theme = {
  ...DefaultTheme,
  fonts: {
    ...DefaultTheme.fonts,
    default: {
      ...DefaultTheme.fonts.default,
      normal: {
        name: 'SourceSansPro-Regular',
        weight: 'normal',
      },
      bold: {
        name: 'SourceSansPro-Bold',
        weight: '700',
      },
      medium: {
        name: 'SourceSansPro-SemiBold',
        weight: '500',
      },
    },
    italic: {
      ...DefaultTheme.fonts.italic,
      normal: {
        name: 'SourceSansPro-Italic',
        weight: 'normal',
      },
    },
  },
  colors: ColorTheme,
};
