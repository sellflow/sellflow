import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { default as NativeStepIndicator } from 'react-native-step-indicator';
import { Text } from 'exoflex';

import { IndicatorItem } from '../types/types';
import { COLORS } from '../general/constants/colors';
import { FONT_SIZE } from '../general/constants/fonts';

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  indicatorItems: Array<IndicatorItem>;
  stepIndicatorCurrentColor?: string;
  labelColor?: string;
};

export default function StepIndicator(props: Props) {
  let {
    indicatorItems,
    containerStyle,
    stepIndicatorCurrentColor = COLORS.stepIndicator,
    labelColor = COLORS.stepIndicatorLabel,
  } = props;
  let labels = indicatorItems.map(({ label }) => label);
  let labelStyle = { color: labelColor };

  const defaultStyles = {
    currentStepIndicatorSize: 8,
    stepIndicatorSize: 8,
    separatorStrokeWidth: 2,
    stepStrokeWidth: 2,
    currentStepStrokeWidth: 0,

    stepIndicatorCurrentColor,
    stepIndicatorUnFinishedColor: COLORS.white,
    stepIndicatorFinishedColor: COLORS.white,

    stepStrokeCurrentColor: stepIndicatorCurrentColor,
    stepStrokeUnFinishedColor: COLORS.lightGrey,
    stepStrokeFinishedColor: COLORS.lightGrey,

    separatorUnFinishedColor: COLORS.lightGrey,
    separatorFinishedColor: COLORS.lightGrey,

    stepIndicatorLabelCurrentColor: COLORS.transparent,
    stepIndicatorLabelFinishedColor: COLORS.transparent,
    stepIndicatorLabelUnFinishedColor: COLORS.transparent,

    labelAlign: 'flex-start',
  };

  let renderLabel = ({
    position,
    label,
  }: {
    position: number;
    label: string;
  }) => {
    let timestamp = indicatorItems[position].timestamp;

    return (
      <View style={styles.labelContainer}>
        <Text weight="medium" style={[styles.defaultLabelStyle, labelStyle]}>
          {label}
        </Text>
        <Text>{timestamp ? timestamp : ' '}</Text>
      </View>
    );
  };

  return (
    <ScrollView
      style={containerStyle}
      alwaysBounceVertical={false}
      showsVerticalScrollIndicator={false}
    >
      <NativeStepIndicator
        customStyles={defaultStyles}
        currentPosition={0}
        labels={labels}
        renderLabel={renderLabel}
        direction="vertical"
        stepCount={indicatorItems.length}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  labelContainer: {
    height: 42,
    marginLeft: 16,
    marginTop: 20,
    justifyContent: 'space-between',
  },
  defaultLabelStyle: {
    fontSize: FONT_SIZE.medium,
  },
});
