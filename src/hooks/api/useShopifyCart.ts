import { MutationHookOptions, useMutation } from '@apollo/react-hooks';
import {
  ShoppingCartReplaceItem,
  ShoppingCartReplaceItemVariables,
} from '../../generated/server/ShoppingCartReplaceItem';
import {
  SHOPPING_CART_REPLACE_ITEMS,
  SHOPPING_CART_CREATE,
  SHOPPING_CART_UPDATE_ADDRESS,
} from '../../graphql/server/shoppingCart';
import {
  ShoppingCartCreate,
  ShoppingCartCreateVariables,
} from '../../generated/server/ShoppingCartCreate';
import {
  ShoppingCartUpdateAddress,
  ShoppingCartUpdateAddressVariables,
} from '../../generated/server/ShoppingCartUpdateAddress';

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

function useShopifyCartUpdateAddress(
  options: MutationHookOptions<
    ShoppingCartUpdateAddress,
    ShoppingCartUpdateAddressVariables
  >,
) {
  let [updateCartAddress, { data, loading }] = useMutation<
    ShoppingCartUpdateAddress,
    ShoppingCartUpdateAddressVariables
  >(SHOPPING_CART_UPDATE_ADDRESS, { ...options });
  return { updateCartAddress, data, loading };
}

export {
  useShopifyCreateCheckout,
  useShopifyShoppingCartReplaceItems,
  useShopifyCartUpdateAddress,
};
