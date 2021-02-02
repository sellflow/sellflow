import { ApolloCache } from 'apollo-cache';

import { LocalCache } from '../../types/types';
import { SetShoppingCartVariables } from '../../generated/client/SetShoppingCart';

function setShoppingCartResolver(
  _: object,
  args: SetShoppingCartVariables,
  { cache }: { cache: ApolloCache<LocalCache> },
) {
  let { items, id } = args;
  let newItems = items.map((item) => {
    return { ...item, __typename: 'LineItem' };
  });

  cache.writeData({
    data: {
      shoppingCart: {
        __typename: 'ShoppingCart',
        id,
        items: newItems,
      },
    },
  });

  return null;
}

export { setShoppingCartResolver };
