import { BottomTabBarOptions } from '@react-navigation/bottom-tabs';
import { DefaultTheme, Theme } from 'exoflex';
import { StackNavigationOptions } from '@react-navigation/stack';

import { COLORS } from './colors';
import { FONT_SIZE, FONT_FAMILY, FONTS } from './fonts';

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
        source: FONTS.SourceSansProRegular,
      },
      bold: {
        name: 'SourceSansPro-Bold',
        weight: '700',
        source: FONTS.SourceSansProBold,
      },
      medium: {
        name: 'SourceSansPro-SemiBold',
        weight: '500',
        source: FONTS.SourceSansProSemiBold,
      },
    },
    italic: {
      ...DefaultTheme.fonts.italic,
      normal: {
        name: 'SourceSansPro-Italic',
        weight: 'normal',
        source: FONTS.SourceSansProItalic,
      },
    },
  },
  colors: ColorTheme,
};
export const headerOptions: StackNavigationOptions = {
  cardStyle: {
    backgroundColor: COLORS.white,
  },
  headerTitleStyle: {
    fontFamily: FONT_FAMILY.MEDIUM,
    fontSize: FONT_SIZE.large,
  },
  gestureEnabled: false,
};

export const tabBarOptions: BottomTabBarOptions = {
  activeTintColor: COLORS.primaryColor,
  inactiveTintColor: COLORS.inactive,
  tabStyle: {
    paddingTop: 16,
    marginBottom: 5,
    height: 64,
  },
  style: {
    height: 90,
  },
  labelPosition: 'below-icon',
  labelStyle: {
    fontFamily: FONT_FAMILY.REGULAR,
  },
};
