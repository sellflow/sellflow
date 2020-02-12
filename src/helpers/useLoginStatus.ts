import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { initialData } from '../graphql/initialData';
import { useResetCart } from '../hooks/api/useShoppingCart';
import { useSetAuthenticatedUser } from '../hooks/api/useAuthenticatedUser';
import { getToken, removeToken } from './authToken';

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
        let token = await getToken();
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
    removeToken();
    resetShoppingCart();
    setUser({
      variables: {
        user: initialData.authenticatedUser,
      },
    });
  };

  return { customerAccessToken, logout };
}
