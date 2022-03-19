import React from 'react';
import {
  SafeAreaView,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { IconButton, Surface, useTheme } from 'react-native-paper';

import { COLORS } from '../constants/colors';
import useFadingAnimation from '../helpers/useFadingAnimation';

import Text from './Text';

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  data: Data;
  showIcon?: boolean;
};

type Data = {
  message: string;
  isVisible: boolean;
  hideToast?: () => void;
};

export default function Toast(props: Props) {
  let { colors: themeColors } = useTheme();
  let { containerStyle, textStyle, data, showIcon = true } = props;
  let { isVisible, message, hideToast } = data;

  let [animatedVisibility, animatedValue] = useFadingAnimation(isVisible, {
    duration: 200,
  });

  if (!animatedVisibility) {
    return null;
  }

  return (
    <SafeAreaView pointerEvents="box-none" style={styles.wrapper}>
      <Surface
        pointerEvents="box-none"
        accessibilityLiveRegion="polite"
        style={
          [
            styles.container,
            !showIcon && styles.containerNoIcon,
            {
              opacity: animatedValue,
              transform: [
                {
                  scale: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
            containerStyle,
          ] as StyleProp<ViewStyle>
        }
      >
        <Text style={[{ color: themeColors.surface }, textStyle]}>
          {message}
        </Text>
        {showIcon && hideToast && (
          <IconButton icon={'close'} color={COLORS.white} onPress={hideToast} />
        )}
      </Surface>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
  },
  container: {
    elevation: 6,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 8,
    height: 48,
    padding: 5,
    width: '80%',
    paddingLeft: 16,
    backgroundColor: COLORS.black,
    borderRadius: 2,
    marginBottom: 40,
  },
  containerNoIcon: {
    paddingLeft: 16,
  },
});
