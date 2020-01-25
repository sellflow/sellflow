import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'exoflex';

import { CarouselItem } from '../types/types';
import { COLORS } from '../constants/colors';
import { FONT_SIZE } from '../constants/fonts';

export const carouselData: Array<CarouselItem> = [
  {
    render: () => (
      <Text weight="bold" style={styles.title}>
        Beautiful and dramatic Antelope Canyon
      </Text>
    ),
    image: 'https://i.imgur.com/UYiroysl.jpg',
  },
  {
    render: () => (
      <Text weight="bold" style={styles.title}>
        Earlier this morning, NYC
      </Text>
    ),
    image: 'https://i.imgur.com/UPrs1EWl.jpg',
  },
  {
    render: () => (
      <Text weight="bold" style={styles.title}>
        White Pocket Sunset
      </Text>
    ),
    image: 'https://i.imgur.com/MABUbpDl.jpg',
  },
  {
    render: () => (
      <Text weight="bold" style={styles.title}>
        Acrocorinth, Greece
      </Text>
    ),
    image: 'https://i.imgur.com/KZsmUi2l.jpg',
  },
  {
    render: () => (
      <Text weight="bold" style={styles.title}>
        The lone tree, majestic landscape of New Zealand
      </Text>
    ),
    image: 'https://i.imgur.com/2nCt3Sbl.jpg',
  },
  {
    render: () => (
      <Text weight="bold" style={styles.title}>
        Middle Earth, Germany
      </Text>
    ),
    image: 'https://i.imgur.com/lceHsT6l.jpg',
  },
];

const styles = StyleSheet.create({
  title: {
    marginBottom: 20,
    color: COLORS.white,
    fontSize: FONT_SIZE.large,
  },
});
