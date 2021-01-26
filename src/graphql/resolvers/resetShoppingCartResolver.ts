import { ApolloCache } from 'apollo-cache';

import { LocalCache } from '../../types/types';
import { initialData } from '../initialData';

function resetShoppingCartResolver(
  _: Record<string, unknown>,
  __: Record<string, unknown>,
  { cache }: { cache: ApolloCache<LocalCache> },
) {
  cache.writeData({
    data: {
      shoppingCart: initialData.shoppingCart,
    },
  });

  return null;
}

export { resetShoppingCartResolver };
