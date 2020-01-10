import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'exoflex';

import { CarouselItem } from '../types/types';
import { COLORS } from '../constants/colors';
import { FONT_SIZE } from '../constants/fonts';

const styles = StyleSheet.create({
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 160,
    height: 40,
    borderRadius: 0,
  },
  title: {
    marginBottom: 20,
    color: COLORS.white,
    fontSize: FONT_SIZE.large,
  },
  label: {
    color: COLORS.white,
  },
});

export const CarouselData: Array<CarouselItem> = [
  {
    content: (
      <View style={styles.contentContainer}>
        <Text weight="bold" style={styles.title}>
          Beautiful and dramatic Antelope Canyon
        </Text>
        <Button
          preset="primary"
          style={styles.button}
          labelStyle={styles.label}
        >
          Check Out Now
        </Button>
      </View>
    ),
    image: 'https://i.imgur.com/UYiroysl.jpg',
  },
  {
    content: (
      <Text weight="bold" style={styles.title}>
        Earlier this morning, NYC
      </Text>
    ),
    image: 'https://i.imgur.com/UPrs1EWl.jpg',
  },
  {
    content: (
      <Text weight="bold" style={styles.title}>
        White Pocket Sunset
      </Text>
    ),
    image: 'https://i.imgur.com/MABUbpDl.jpg',
  },
  {
    content: (
      <Text weight="bold" style={styles.title}>
        Acrocorinth, Greece
      </Text>
    ),
    image: 'https://i.imgur.com/KZsmUi2l.jpg',
  },
  {
    content: (
      <Text weight="bold" style={styles.title}>
        The lone tree, majestic landscape of New Zealand
      </Text>
    ),
    image: 'https://i.imgur.com/2nCt3Sbl.jpg',
  },
  {
    content: (
      <Text weight="bold" style={styles.title}>
        Middle Earth, Germany
      </Text>
    ),
    image: 'https://i.imgur.com/lceHsT6l.jpg',
  },
];
