import { AsyncStorage } from 'react-native';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { ApolloLink } from 'apollo-link';
import { persistCache } from 'apollo-cache-persist';
import { PersistentStorage, PersistedData } from 'apollo-cache-persist/types';

import { STOREFRONT_API_URL, STOREFRONT_ACCESS_TOKEN } from '../constants/api';
import { initialData } from './initialData';
import { authResolver } from './resolvers/authResolver';
import { addToWishlistResolver } from './resolvers/addToWishlistResolver';
import { removeFromWishlistResolver } from './resolvers/removeFromWishlistResolver';

const cache = new InMemoryCache();

const httpLink = createHttpLink({
  uri: STOREFRONT_API_URL,
});
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
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

  cache.writeData({ data: initialData });

  return new ApolloClient({
    link: ApolloLink.from([authLink, httpLink]),
    resolvers: {
      Mutation: {
        setCustomer: authResolver,
        addToWishlist: addToWishlistResolver,
        removeFromWishlist: removeFromWishlistResolver,
      },
    },
    cache,
  });
}

export const client = setupApolloClient();
