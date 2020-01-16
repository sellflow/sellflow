import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Button } from 'exoflex';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../types/Navigation';

export default function HomeScene() {
  let { navigate } = useNavigation<NavigationProp<'Home'>>();
  return (
    <ScrollView style={styles.container}>
      <Button style={styles.button} onPress={() => navigate('OrderHistory')}>
        {t('Go To History')}
      </Button>
      <Button
        style={styles.button}
        onPress={() => navigate('OrderDetails', { orderID: '#1234567890' })}
      >
        {t('Go To Details')}
      </Button>
      <Button style={styles.button} onPress={() => navigate('ProductDetails')}>
        {t('Go To Product Detail')}
      </Button>
      <Button onPress={() => navigate('ShoppingCart')} style={styles.button}>
        {t('Go To Shopping Cart')}
      </Button>
      <Button
        onPress={() => navigate('ProductCollection')}
        style={styles.button}
      >
        {t('Go To Product Collection')}
      </Button>

      <Button style={styles.button} onPress={() => navigate('Register')}>
        {t('Go To Register')}
      </Button>
      <Button style={styles.button} onPress={() => navigate('Checkout')}>
        {t('Checkout')}
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
  },
  button: {
    marginBottom: 20,
  },
});
