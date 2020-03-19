import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { storiesOf } from '@storybook/react-native';

import { Surface } from '../../../core-ui';
import { COLORS } from '../../../constants/colors';
import { FONT_SIZE, FONT_FAMILY } from '../../../constants/fonts';
import { addressItemData } from '../../../fixtures/AddressItemData';

export default function SurfaceStory() {
  return storiesOf('Surface', module).add('Surface', () => (
    <View style={styles.container}>
      <Surface containerStyle={styles.padding}>
        <Text style={styles.title}>{addressItemData[0].name}</Text>
        <Text>{addressItemData[0].address1}</Text>
        <Text>{addressItemData[0].phone}</Text>
      </Surface>
      <Surface mode="row" containerStyle={styles.padding}>
        <Text>{'Delivered'}</Text>
        <View
          style={[
            styles.indicator,
            { backgroundColor: COLORS.orderStatusDelivered },
          ]}
        />
      </Surface>
      <Surface mode="row" containerStyle={styles.padding}>
        <Text>{'On Courier'}</Text>
        <View
          style={[
            styles.indicator,
            { backgroundColor: COLORS.orderStatusOnProcess },
          ]}
        />
      </Surface>
    </View>
  ));
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  text: {
    fontFamily: FONT_FAMILY.REGULAR,
    fontSize: FONT_SIZE.medium,
  },
  title: {
    fontFamily: FONT_FAMILY.BOLD,
    fontSize: FONT_SIZE.large,
  },
  padding: {
    padding: 12,
  },
});
