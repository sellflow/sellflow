import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import image from '../.././assets/images/checkMark.png';
import { Button } from 'exoflex';
import { defaultButton } from '../constants/theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavProp, StackRouteProp } from '../types/Navigation';
import { useAuth } from '../helpers/useAuth';
export default function OrderPlacedConfirmation() {
  let { navigate } = useNavigation<StackNavProp<'OrderPlacedConfirmation'>>();
  let route = useRoute<StackRouteProp<'OrderPlacedConfirmation'>>();
  const navigation = useNavigation();
  let { orderNumber } = route.params;
  let { authToken } = useAuth();

  return (
    <SafeAreaView style={styles.scene}>
      <Image source={image} width={590} height={590} style={styles.image} />

      <Text style={styles.purchase}>
        {t(
          `Thank you for your purchase! Your order {orderNumber} has been received and will be process.`,
          { orderNumber },
        )}
      </Text>

      <Button
        style={defaultButton}
        onPress={() => {
          // Put Order History Scene Here
          navigate('OrderHistory', { customerAccessToken: authToken });
        }}
      >
        {t('VIEW ORDER HISTORY')}
      </Button>

      <TouchableOpacity
        style={styles.buttonToHome}
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [
              { name: 'Home' },
              { name: 'Wishlist' },
              { name: 'Profile' },
            ],
          })
        }
      >
        <Text style={styles.backToHomeText}>{t('Back To Home')}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scene: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
  image: {
    resizeMode: 'contain',
    maxWidth: 280,
    maxHeight: 280,
    borderRadius: 200 / 2,
  },
  buttonToHome: {
    top: 100,
  },
  backToHomeText: {
    color: '#004fb4',
    textTransform: 'uppercase',
  },
  purchase: {
    fontSize: 14,
    textAlign: 'center',
    paddingBottom: 100,
  },
});
