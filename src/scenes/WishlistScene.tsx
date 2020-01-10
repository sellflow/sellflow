import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'exoflex';

export default function WishlistScene() {
  return (
    <View style={styles.container}>
      <Text>{t('Wishlist Scene')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
