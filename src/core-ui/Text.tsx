import React, { useMemo } from 'react';
import {
  StyleSheet,
  TextProps as NativeTextProps,
  TextStyle,
} from 'react-native';
import { Text as PaperText, useTheme } from 'react-native-paper';

type Props = NativeTextProps & {
  uppercase?: boolean;
  weight?: 'bold' | 'medium' | 'normal';
  fontStyle?: 'normal' | 'italic';
};

function resolveTextStyle(
  fonts: ReactNativePaper.ThemeFonts,
  fontWeight: 'bold' | 'medium' | 'normal',
  fontStyle: 'normal' | 'italic',
): TextStyle | undefined {
  let useItalicPreset = fontStyle === 'italic';

  let fontFamily = useItalicPreset
    ? fonts.italic.fontFamily
    : fonts.regular.fontFamily;
  switch (fontWeight) {
    case 'bold':
      fontFamily = fonts.bold?.fontFamily;
      break;
    case 'medium':
      fontFamily = fonts.medium.fontFamily;
      break;
  }

  return {
    fontFamily,
  };
}

export default function Text(props: Props) {
  let {
    uppercase: isUppercase,
    weight = 'normal',
    fontStyle = 'normal',
    style,
    ...otherProps
  } = props;
  let { colors, fonts } = useTheme();

  let resolvedTextStyle = useMemo(
    () => resolveTextStyle(fonts, weight, fontStyle),
    [fonts, weight, fontStyle],
  );

  return (
    <PaperText
      {...otherProps}
      style={[
        resolvedTextStyle,
        { color: colors.text },
        isUppercase && styles.uppercaseLabel,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  uppercaseLabel: {
    textTransform: 'uppercase',
  },
});
