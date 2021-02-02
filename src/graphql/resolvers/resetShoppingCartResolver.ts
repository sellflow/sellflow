import { ApolloCache } from 'apollo-cache';

import { LocalCache } from '../../types/types';
import { initialData } from '../initialData';

function resetShoppingCartResolver(
  _: object,
  __: object,
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
