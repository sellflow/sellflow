import { ApolloCache } from 'apollo-cache';

import { GetShoppingCart } from '../../generated/client/GetShoppingCart';
import { SetShoppingCartIDVariables } from '../../generated/client/SetShoppingCartID';
import { LocalCache } from '../../types/types';
import { GET_SHOPPING_CART } from '../client/shoppingCartQueries';

function setShoppingCartIDResolver(
  _: object,
  args: SetShoppingCartIDVariables,
  { cache }: { cache: ApolloCache<LocalCache> },
) {
  let { id } = args;
  let cartData = cache.readQuery<GetShoppingCart>({ query: GET_SHOPPING_CART });

  if (!cartData) {
    return;
  }

  let { shoppingCart } = cartData;

  cache.writeData({
    data: {
      shoppingCart: {
        ...shoppingCart,
        id,
      },
    },
  });

  return null;
}

export { setShoppingCartIDResolver };
