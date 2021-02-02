import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Image,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'exoflex';

import { defaultButton, defaultButtonLabel } from '../constants/theme';
import { useAuth } from '../helpers/useAuth';
import { useOrderHistory } from '../hooks/api/useOrderHistory';
import { successImage } from '../../assets/images';

export default function OrderPlacedConfirmation() {
  let { reset, navigate } = useNavigation();
  let { authToken } = useAuth();

  let { orderHistory, loading } = useOrderHistory(1, authToken);
  let orderNumber = orderHistory.length > 0 ? orderHistory[0].orderNumber : '';

  return loading ? (
    <ActivityIndicator style={styles.centered} />
  ) : (
    <SafeAreaView style={styles.scene}>
      <View style={styles.textView}>
        <Image source={successImage} style={styles.image} />
        <Text style={styles.purchase}>
          {t(
            `Thank you for your purchase! Your order {orderNumber} has been received and will be processed shortly.`,
            { orderNumber },
          )}
        </Text>
      </View>

      <Button
        style={defaultButton}
        labelStyle={defaultButtonLabel}
        onPress={() => {
          reset({
            index: 0,
            routes: [
              {
                name: 'Home',
              },
            ],
          });
          navigate('OrderHistory', {
            customerAccessToken: authToken,
          });
        }}
      >
        {t('View Order History')}
      </Button>

      <Button
        preset="invisible"
        style={styles.backButton}
        labelStyle={defaultButtonLabel}
        onPress={() =>
          reset({
            index: 0,
            routes: [{ name: 'Home' }],
          })
        }
      >
        {t('Back To Home')}
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    justifyContent: 'space-between',
    marginHorizontal: 24,
  },
  textView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  image: {
    maxWidth: 84,
    maxHeight: 84,
  },
  purchase: {
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 100,
    marginHorizontal: 12,
    lineHeight: 24,
  },
  backButton: {
    marginTop: 16,
    marginBottom: 24,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
