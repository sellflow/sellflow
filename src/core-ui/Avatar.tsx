import React from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Text } from 'exoflex';

import { COLORS } from '../constants/colors';
import { FONT_FAMILY } from '../constants/fonts';

type Props = {
  firstName: string;
  lastName: string;
  containerStyle?: StyleProp<ViewStyle>;
  size: number;
};

export default function Avatar(props: Props) {
  let { firstName, lastName, size, containerStyle } = props;

  let avatarSize: StyleProp<ViewStyle> = {
    width: size,
    height: size,
    borderRadius: Math.round(size / 2),
  };
  let textSize: StyleProp<TextStyle> = {
    fontSize: Math.round(size / 2),
  };

  return (
    <View style={[styles.avatar, containerStyle, avatarSize]}>
      <Text
        style={[styles.nameInitial, textSize]}
      >{`${firstName[0]}${lastName[0]}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: COLORS.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameInitial: {
    color: COLORS.white,
    fontFamily: FONT_FAMILY.MEDIUM,
  },
});
