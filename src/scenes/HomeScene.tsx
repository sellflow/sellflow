import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'exoflex';

export default function HomeScene() {
  return (
    <View style={styles.container}>
      <Text>{t('Home Scene')}</Text>
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
