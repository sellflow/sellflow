import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import { PersistedData, PersistentStorage } from 'apollo-cache-persist/types';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { createHttpLink } from 'apollo-link-http';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { STOREFRONT_ACCESS_TOKEN, STOREFRONT_API_URL } from '../constants/api';
import { initialData } from './initialData';
import { addToShoppingCartResolver } from './resolvers/addToShoppingCartResolver';
import { addToWishlistResolver } from './resolvers/addToWishlistResolver';
import { recentSearchResolver } from './resolvers/recentSearchResolver';
import { removeFromWishlistResolver } from './resolvers/removeFromWishlistResolver';
import { resetShoppingCartResolver } from './resolvers/resetShoppingCartResolver';
import { setAuthenticatedUserResolver } from './resolvers/setAuthenticatedUserResolver';
import { setShoppingCartResolver } from './resolvers/setShoppingCart';
import { setShoppingCartIDResolver } from './resolvers/setShoppingCartIDResolver';
import { setDefaultCountryResolver } from './resolvers/setDefaultCountryResolver';

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
        setDefaultCountry: setDefaultCountryResolver,
      },
    },
    cache,
  });
}

export const client = setupApolloClient();
