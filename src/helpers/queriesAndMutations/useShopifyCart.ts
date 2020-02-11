import { MutationHookOptions, useMutation } from '@apollo/react-hooks';
import {
  ShoppingCartReplaceItem,
  ShoppingCartReplaceItemVariables,
} from '../../generated/server/ShoppingCartReplaceItem';
import {
  SHOPPING_CART_REPLACE_ITEMS,
  SHOPPING_CART_CREATE,
} from '../../graphql/server/shoppingCart';
import {
  ShoppingCartCreate,
  ShoppingCartCreateVariables,
} from '../../generated/server/ShoppingCartCreate';

function useShopifyShoppingCartReplaceItems(
  options: MutationHookOptions<
    ShoppingCartReplaceItem,
    ShoppingCartReplaceItemVariables
  >,
) {
  let [shoppingCartReplaceItems, { loading }] = useMutation<
    ShoppingCartReplaceItem,
    ShoppingCartReplaceItemVariables
  >(SHOPPING_CART_REPLACE_ITEMS, { ...options });
  return { shoppingCartReplaceItems, loading };
}

function useShopifyCreateCheckout(
  options: MutationHookOptions<ShoppingCartCreate, ShoppingCartCreateVariables>,
) {
  let [createCheckout, { loading }] = useMutation<
    ShoppingCartCreate,
    ShoppingCartCreateVariables
  >(SHOPPING_CART_CREATE, { ...options });
  return { createCheckout, loading };
}

export { useShopifyCreateCheckout, useShopifyShoppingCartReplaceItems };
