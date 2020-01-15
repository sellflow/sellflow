import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'exoflex';

export default function ProfileScene() {
  return (
    <View style={styles.container}>
      <Text>{t('Log In Scene')}</Text>
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
