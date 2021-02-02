import { AsyncStorage } from 'react-native';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { ApolloLink } from 'apollo-link';
import { persistCache } from 'apollo-cache-persist';
import { PersistentStorage, PersistedData } from 'apollo-cache-persist/types';

import { STOREFRONT_API_URL, STOREFRONT_ACCESS_TOKEN } from '../constants/api';

import { setAuthenticatedUserResolver } from './resolvers/setAuthenticatedUserResolver';
import { addToWishlistResolver } from './resolvers/addToWishlistResolver';
import { removeFromWishlistResolver } from './resolvers/removeFromWishlistResolver';
import { initialData } from './initialData';
import { addToShoppingCartResolver } from './resolvers/addToShoppingCartResolver';
import { setShoppingCartIDResolver } from './resolvers/setShoppingCartIDResolver';
import { resetShoppingCartResolver } from './resolvers/resetShoppingCartResolver';
import { recentSearchResolver } from './resolvers/recentSearchResolver';
import { setShoppingCartResolver } from './resolvers/setShoppingCart';
import { setDefaultCurrencyResolver } from './resolvers/setDefaultCurrencyResolver';

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
        setAuthenticatedUser: setAuthenticatedUserResolver,
        addToWishlist: addToWishlistResolver,
        removeFromWishlist: removeFromWishlistResolver,
        addToShoppingCart: addToShoppingCartResolver,
        setShoppingCart: setShoppingCartResolver,
        setShoppingCartID: setShoppingCartIDResolver,
        resetShoppingCart: resetShoppingCartResolver,
        setRecentSearch: recentSearchResolver,
        setDefaultCurrency: setDefaultCurrencyResolver,
      },
    },
    cache,
  });
}

export const client = setupApolloClient();
