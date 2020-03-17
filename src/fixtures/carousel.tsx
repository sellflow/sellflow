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
        {t('Sale')}
      </Text>
    ),
    image:
      'https://images.unsplash.com/photo-1513451732213-5775a1c40335?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1334&q=80',
  },
  {
    image:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?ixlib=rb-1.2.1&auto=format&fit=crop&w=2738&q=80',
  },
  {
    image:
      'https://images.unsplash.com/photo-1513884923967-4b182ef167ab?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80',
  },
];

const styles = StyleSheet.create({
  title: {
    marginBottom: 20,
    color: COLORS.white,
    fontSize: FONT_SIZE.extraLarge,
  },
});
