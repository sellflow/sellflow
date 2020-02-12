import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { AsyncStorage } from 'react-native';

import { initialData } from '../graphql/initialData';
import { useResetCart } from '../hooks/api/useShoppingCart';
import { useSetAuthenticatedUser } from '../hooks/api/useAuthenticatedUser';

export default function useLoginStatus(navigate: () => void) {
  let [customerAccessToken, setCustomerAccessToken] = useState('');
  let { resetShoppingCart } = useResetCart();
  let { setUser } = useSetAuthenticatedUser({
    onCompleted: () => {
      navigate();
    },
  });

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      let checkUserAuth = async () => {
        let token = await AsyncStorage.getItem('accessToken');
        if (isActive) {
          if (token) {
            setCustomerAccessToken(token);
          } else {
            navigate();
          }
        }
      };
      checkUserAuth();

      return () => {
        isActive = false;
      };
    }, [navigate]),
  );

  let logout = () => {
    setCustomerAccessToken('');
    AsyncStorage.removeItem('accessToken');
    resetShoppingCart();
    setUser({
      variables: {
        user: initialData.authenticatedUser,
      },
    });
  };

  return { customerAccessToken, logout };
}
