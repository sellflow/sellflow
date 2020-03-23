import React from 'react';
import { StyleProp, ViewStyle, TextStyle } from 'react-native';
import { BottomTabBarOptions } from '@react-navigation/bottom-tabs';
import { DefaultTheme, Theme, IconButton } from 'exoflex';
import { StackNavigationOptions } from '@react-navigation/stack';

import { COLORS } from './colors';
import { FONT_SIZE, FONT_FAMILY, FONT } from './fonts';

export const ColorTheme = {
  ...DefaultTheme.colors,
  primary: COLORS.primaryColor,
  accent: COLORS.primaryColor,
};

export const CustomTheme: Theme = {
  ...DefaultTheme,
  fonts: {
    ...DefaultTheme.fonts,
    default: {
      ...DefaultTheme.fonts.default,
      normal: {
        name: FONT_FAMILY.REGULAR,
        weight: 'normal',
        source: FONT.REGULAR,
      },
      medium: {
        name: FONT_FAMILY.MEDIUM,
        weight: '500',
        source: FONT.MEDIUM,
      },
      bold: {
        name: FONT_FAMILY.BOLD,
        weight: '700',
        source: FONT.BOLD,
      },
    },
    italic: {
      ...DefaultTheme.fonts.italic,
      normal: {
        name: FONT_FAMILY.ITALIC,
        weight: 'normal',
        source: FONT.ITALIC,
      },
    },
  },
  colors: ColorTheme,
  roundness: 2,
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
      icon="chevron-left"
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
