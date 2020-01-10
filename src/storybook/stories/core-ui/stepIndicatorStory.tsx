import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { StyleSheet, View } from 'react-native';
import { StepIndicator } from '../../../core-ui';
import { IndicatorItem } from '../../../types/types';
import formatDateTime from '../../../helpers/formatDateTime';
import { COLORS } from '../../../constants/colors';

export default function stepIndicatorStory() {
  let timestamp = formatDateTime(new Date().toISOString());
  let indicatorItems: Array<IndicatorItem> = [
    { label: 'Delivered', timestamp },
    { label: 'Out for Delivery', timestamp },
    { label: 'In Process', timestamp },
    { label: 'Order Received', timestamp },
  ];
  return storiesOf('Step Indicator', module).add('Step Indicator', () => (
    <View style={styles.container}>
      <StepIndicator
        indicatorItems={indicatorItems}
        containerStyle={styles.container}
      />
      <StepIndicator
        indicatorItems={indicatorItems}
        containerStyle={styles.container}
        stepIndicatorCurrentColor={COLORS.red}
        labelColor={COLORS.orange}
      />
    </View>
  ));
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 10,
    marginTop: 20,
    marginBottom: 50,
  },
});
