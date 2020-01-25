import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { View, StyleSheet } from 'react-native';

import { Carousel } from '../../../core-ui';
import { carouselData } from '../../../fixtures/carousel';

export default function carouselStory() {
  return storiesOf('Carousel', module).add('Carousel', () => (
    <View style={style.container}>
      <Carousel data={carouselData} height={250} />
    </View>
  ));
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
