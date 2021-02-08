import React, {
  useMemo,
  useState,
  useContext,
  createContext,
  useEffect,
} from 'react';
import {
  useGetAuthenticatedUser,
  useSetAuthenticatedUser,
} from '../hooks/api/useAuthenticatedUser';
import { useCustomerRenewToken } from '../hooks/api/useCustomer';

import { getToken, removeToken, saveToken } from './authToken';

type Context = {
  authToken: string;
  setAuthToken: (token: string) => void;
};

type Props = {
  children: JSX.Element;
};

let AuthContext = createContext<Context>({
  authToken: '',
  setAuthToken: () => {},
});

export function Provider(props: Props) {
  let [token, setToken] = useState<string>('');
  let { data: userData } = useGetAuthenticatedUser();
  let expiresAt = new Date(userData?.authenticatedUser.expiresAt || '');
  let now = new Date();

  now.setDate(now.getDate() + 42);

  let { setUser } = useSetAuthenticatedUser();

  let { renewToken } = useCustomerRenewToken({
    variables: { customerAccessToken: token },
    onCompleted: ({ customerAccessTokenRenew }) => {
      if (
        customerAccessTokenRenew &&
        customerAccessTokenRenew.customerAccessToken
      ) {
        let {
          accessToken,
          expiresAt,
        } = customerAccessTokenRenew.customerAccessToken;
        setToken(accessToken);
        if (userData && userData) {
          setUser({
            variables: {
              user: {
                ...userData?.authenticatedUser,
                expiresAt: expiresAt,
              },
            },
          });
        }
      }
    },
  });

  console.log(expiresAt, now, token);

  useEffect(() => {
    getToken().then((token) => {
      // TODO: Check token expiration date
      if (expiresAt < now) {
        console.log('NOW IS THE TIME TO RENEW');
        renewToken();
      }
      setToken(token || '');
    });
  }, []);

  let context = useMemo(
    () => ({
      authToken: token,
      setAuthToken: (token: string) => {
        setToken(token);
        if (!token) {
          removeToken();
        } else {
          saveToken(token);
        }
      },
    }),
    [token, setToken],
  );
  return (
    <AuthContext.Provider value={context}>
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
