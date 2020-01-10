import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'exoflex';
import { useNavigation } from '@react-navigation/native';

export default function HomeScene() {
  let { navigate } = useNavigation();
  return (
    <View style={styles.container}>
      <Button onPress={() => navigate('OrderHistory')}>
        {t('Go To History')}
      </Button>
      <Button onPress={() => navigate('OrderDetails')}>
        {t('Go To Details')}
      </Button>
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
