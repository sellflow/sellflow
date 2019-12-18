import { AsyncStorage } from 'react-native';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { ApolloLink } from 'apollo-link';
import { persistCache } from 'apollo-cache-persist';
import { PersistentStorage, PersistedData } from 'apollo-cache-persist/types';

import { STOREFRONT_API } from '../general/constants/api';
import { userData } from './userData';

const cache = new InMemoryCache();
const httpLink = createHttpLink({
  uri: STOREFRONT_API,
});
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      // TODO: Add necessary header
    },
  };
});

async function setupPersistCache() {
  await persistCache({
    cache,
    storage: AsyncStorage as PersistentStorage<
      PersistedData<NormalizedCacheObject>
    >,
  });
}

function setupApolloClient() {
  setupPersistCache();

  cache.writeData(userData);

  return new ApolloClient({
    link: ApolloLink.from([authLink, httpLink]),
    resolvers: {},
    cache,
  });
}

export const client = setupApolloClient();
