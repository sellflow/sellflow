import color from 'color';
import React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';

import Text from './Text';

type ButtonPresets = {
  primary: 'contained';
  secondary: 'outlined';
  invisible: 'text';
};

type Options = {
  preset: keyof ButtonPresets;
  disabled?: boolean | null;
  buttonColor?: string;
};

type Props = TouchableOpacityProps & {
  preset?: keyof ButtonPresets;
  contentStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  color?: string;
  compact?: boolean;
  loading?: boolean;
  icon?: IconSource;
  uppercase?: boolean;
};

function useButtonStyle(options: Options) {
  let { preset, disabled, buttonColor } = options;
  let { colors, roundness } = useTheme();

  let elevation = 0;
  let textColor = colors.text;
  let backgroundColor = 'transparent';
  let borderColor = 'transparent';
  let borderWidth = 0;

  if (preset === 'primary') {
    elevation = 2;
    backgroundColor = disabled
      ? color(colors.primary)
          .alpha(0.12)
          .rgb()
          .string()
      : !!buttonColor
      ? buttonColor
      : colors.primary;
  } else if (preset === 'secondary') {
    borderColor = disabled
      ? color(colors.primary)
          .alpha(0.4)
          .rgb()
          .string()
      : colors.primary;
    borderWidth = 2;
  }

  let isBackgroundDark =
    backgroundColor === 'transparent' ? false : color(backgroundColor).isDark();
  if (disabled) {
    textColor = color(isBackgroundDark ? 'white' : colors.primary)
      .alpha(0.4)
      .rgb()
      .string();
  } else if (preset === 'primary') {
    textColor = isBackgroundDark ? 'white' : 'black';
  } else if (buttonColor) {
    textColor = buttonColor;
  } else {
    textColor = colors.primary;
  }

  let textStyle = { color: textColor } as TextStyle;
  let buttonStyle = {
    backgroundColor,
    borderColor,
    borderWidth,
    borderRadius: roundness,
    elevation: disabled ? 0 : elevation,
  } as ViewStyle;
  let noShadowStyle = {
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'transparent',
  } as ViewStyle;

  return { textStyle, buttonStyle, noShadowStyle, textColor };
}

export default function Button(props: Props) {
  let {
    preset = 'primary',
    children,
    style,
    contentStyle,
    labelStyle,
    disabled,
    onPress,
    compact,
    color: buttonColor,
    loading,
    icon,
    accessibilityLabel,
    uppercase = true,
    ...otherProps
  } = props;
  let { buttonStyle, textStyle, textColor } = useButtonStyle({
    preset,
    disabled,
    buttonColor,
  });

  return (
    <TouchableOpacity
      {...otherProps}
      onPress={onPress}
      activeOpacity={preset === 'primary' ? 0.8 : 0.5}
      disabled={disabled}
      accessibilityRole="button"
      style={[styles.button, compact && styles.compact, buttonStyle, style]}
    >
      <View style={[styles.content, styles.contentWrapper, contentStyle]}>
        {icon && loading !== true && (
          <View style={styles.icon}>
            <IconButton icon={icon} size={16} color={textColor} />
          </View>
        )}
        {loading && (
          <ActivityIndicator size={16} color={textColor} style={styles.icon} />
        )}
        {typeof children === 'string' ? (
          <Text
            numberOfLines={1}
            style={[
              styles.label,
              compact && styles.compactLabel,
              uppercase && styles.uppercaseLabel,
              textStyle,
              labelStyle,
            ]}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    </TouchableOpacity>
  );
}

export const styles = StyleSheet.create({
  contentWrapper: {
    height: 48,
    minWidth: 158,
  },
  button: {
    minWidth: 64,
    borderStyle: 'solid',
  },
  compact: {
    minWidth: 'auto',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 21,
  },
  label: {
    textAlign: 'center',
    letterSpacing: 1,
    marginVertical: 9,
    marginHorizontal: 16,
  },
  compactLabel: {
    marginHorizontal: 8,
  },
  uppercaseLabel: {
    textTransform: 'uppercase',
  },
});
