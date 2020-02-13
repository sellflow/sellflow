import React, {
  useMemo,
  useState,
  useContext,
  createContext,
  useEffect,
} from 'react';
import { ActivityIndicator } from 'exoflex';
import { getToken, removeToken, saveToken } from './authToken';

type Context = {
  authToken: string;
  setAuthToken: (token: string | null) => void;
};

type Props = {
  children: JSX.Element;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let AuthContext = createContext<Context>(null as any);

export function Provider(props: Props) {
  let [token, setToken] = useState();
  let [loading, setLoading] = useState(true);

  useEffect(() => {
    getToken().then((token) => {
      // TODO: Check token expiration date
      setToken(token);
      setLoading(false);
    });
  }, []);

  let context = useMemo(
    () => ({
      authToken: token,
      setAuthToken: (token: string | null) => {
        setToken(token);
        if (token == null) {
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
      {loading ? <ActivityIndicator /> : props.children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
