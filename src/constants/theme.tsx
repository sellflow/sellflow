import React from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { DefaultTheme, IconButton } from 'react-native-paper';

import { BottomTabBarOptions } from '@react-navigation/bottom-tabs';
import { StackNavigationOptions } from '@react-navigation/stack';

import { COLORS } from './colors';
import { FONT_FAMILY, FONT_SIZE } from './fonts';

const ColorTheme: ReactNativePaper.ThemeColors = {
  ...DefaultTheme.colors,
  primary: COLORS.primaryColor,
  accent: COLORS.primaryColor,
  border: COLORS.lightGrey,
};

const DefaultFonts: ReactNativePaper.ThemeFonts = {
  ...DefaultTheme.fonts,
  regular: {
    fontFamily: FONT_FAMILY.REGULAR,
    fontWeight: 'normal',
  },
  medium: {
    fontFamily: FONT_FAMILY.MEDIUM,
    fontWeight: '500',
  },
  bold: {
    fontFamily: FONT_FAMILY.BOLD,
    fontWeight: '700',
  },
  italic: {
    fontFamily: FONT_FAMILY.ITALIC,
    fontWeight: 'normal',
  },
};

export const CustomTheme: ReactNativePaper.Theme = {
  ...DefaultTheme,
  fonts: DefaultFonts,
  colors: ColorTheme,
  roundness: 2,
  isRTL: false, // experimental
};

export const headerOptions: StackNavigationOptions = {
  cardStyle: {
    backgroundColor: COLORS.white,
  },
  headerTitleStyle: {
    fontFamily: FONT_FAMILY.MEDIUM,
    fontSize: FONT_SIZE.large,
  },
  headerBackTitleVisible: false,
  headerLeftContainerStyle: {
    marginLeft: 8,
  },
  headerStyle: {
    elevation: 1,
  },
  headerTitleAlign: 'center',
  headerLeft: ({ onPress }) => (
    <IconButton
      icon={CustomTheme.isRTL ? 'chevron-right' : 'chevron-left'}
      color={COLORS.primaryColor}
      size={24}
      onPress={onPress}
    />
  ),
};

export const tabBarOptions: BottomTabBarOptions = {
  activeTintColor: COLORS.primaryColor,
  inactiveTintColor: COLORS.inactive,
  labelPosition: 'below-icon',
  labelStyle: {
    fontFamily: FONT_FAMILY.REGULAR,
  },
  tabStyle: { flex: 1, marginTop: 8, paddingVertical: 6 },
};

export const defaultButton: StyleProp<ViewStyle> = {
  elevation: 0,
  height: 48,
};

export const defaultButtonLabel: StyleProp<TextStyle> = {
  fontSize: FONT_SIZE.medium,
  fontFamily: FONT_FAMILY.MEDIUM,
};

export const flatTextInputContainerStyle: StyleProp<ViewStyle> = {
  height: 75,
  marginBottom: 10,
};

export const flatTextInputStyle: StyleProp<ViewStyle> = { height: 50 };

export const outlinedTextInput: StyleProp<ViewStyle> = { height: 48 };

export const textInputLabel: StyleProp<TextStyle> = {
  fontSize: FONT_SIZE.small,
};
