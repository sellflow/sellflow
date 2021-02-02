import { ApolloCache } from 'apollo-cache';

import { LocalCache } from '../../types/types';
import { GET_SHOPPING_CART } from '../client/shoppingCartQueries';
import { GetShoppingCart } from '../../generated/client/GetShoppingCart';
import { AddToShoppingCartVariables } from '../../generated/client/AddToShoppingCart';

async function addToShoppingCartResolver(
  _: object,
  args: AddToShoppingCartVariables,
  { cache }: { cache: ApolloCache<LocalCache> },
) {
  let { quantity, variantId } = args;

  let cartData = cache.readQuery<GetShoppingCart>({ query: GET_SHOPPING_CART });

  if (!cartData) {
    return;
  }

  let newItem: {
    __typename: 'LineItem';
    quantity: number;
    variantId: string;
  } = {
    __typename: 'LineItem',
    quantity,
    variantId,
  };

  let alreadyInCart = false;

  let newItems = cartData.shoppingCart.items.map((item) => {
    if (item.variantId === variantId) {
      alreadyInCart = true;
      return { ...item, quantity: item.quantity + quantity };
    } else {
      return item;
    }
  });

  if (!alreadyInCart) {
    newItems.push(newItem);
  }
  let shoppingCart = {
    __typename: 'ShoppingCart',
    id: cartData.shoppingCart.id,
    items: newItems,
  };

  cache.writeData({
    data: {
      shoppingCart,
    },
  });

  return shoppingCart;
}

export { addToShoppingCartResolver };
