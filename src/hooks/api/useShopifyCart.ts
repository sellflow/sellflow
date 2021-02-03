import { MutationHookOptions, useMutation } from '@apollo/react-hooks';

import {
  ShoppingCartReplaceItem,
  ShoppingCartReplaceItemVariables,
} from '../../generated/server/ShoppingCartReplaceItem';
import {
  SHOPPING_CART_REPLACE_ITEMS,
  SHOPPING_CART_CREATE,
  SHOPPING_CART_UPDATE_ADDRESS,
  SHOPPING_CART_CUSTOMER_ASSOCIATE,
  SHOPPING_CART_DISCOUNT_CODE_APPLY,
  SHOPPING_CART_DISCOUNT_CODE_REMOVE,
} from '../../graphql/server/shoppingCart';
import {
  ShoppingCartCreate,
  ShoppingCartCreateVariables,
} from '../../generated/server/ShoppingCartCreate';
import {
  ShoppingCartUpdateAddress,
  ShoppingCartUpdateAddressVariables,
} from '../../generated/server/ShoppingCartUpdateAddress';
import {
  ShoppingCartCustomerAssociate,
  ShoppingCartCustomerAssociateVariables,
} from '../../generated/server/ShoppingCartCustomerAssociate';
import {
  ShoppingCartDiscountCodeApply,
  ShoppingCartDiscountCodeApplyVariables,
} from '../../generated/server/ShoppingCartDiscountCodeApply';
import {
  ShoppingCartDiscountCodeRemove,
  ShoppingCartDiscountCodeRemoveVariables,
} from '../../generated/server/ShoppingCartDiscountCodeRemove';

function useCheckoutReplaceItem(
  options?: MutationHookOptions<
    ShoppingCartReplaceItem,
    ShoppingCartReplaceItemVariables
  >,
) {
  let [shoppingCartReplaceItems, { loading }] = useMutation<
    ShoppingCartReplaceItem,
    ShoppingCartReplaceItemVariables
  >(SHOPPING_CART_REPLACE_ITEMS, { fetchPolicy: 'no-cache', ...options });
  return { shoppingCartReplaceItems, loading };
}

function useCheckoutCreate(
  options: MutationHookOptions<ShoppingCartCreate, ShoppingCartCreateVariables>,
) {
  let [createCheckout, { loading }] = useMutation<
    ShoppingCartCreate,
    ShoppingCartCreateVariables
  >(SHOPPING_CART_CREATE, { fetchPolicy: 'no-cache', ...options });
  return { createCheckout, loading };
}

function useCheckoutUpdateAddress(
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
function useCheckoutCustomerAssociate(
  options?: MutationHookOptions<
    ShoppingCartCustomerAssociate,
    ShoppingCartCustomerAssociateVariables
  >,
) {
  let [shoppingCartCustomerAssociate, { data, loading }] = useMutation<
    ShoppingCartCustomerAssociate,
    ShoppingCartCustomerAssociateVariables
  >(SHOPPING_CART_CUSTOMER_ASSOCIATE, { ...options });

  return {
    shoppingCartCustomerAssociate,
    data,
    loading,
  };
}

function useCheckoutDiscountApply(
  options?: MutationHookOptions<
    ShoppingCartDiscountCodeApply,
    ShoppingCartDiscountCodeApplyVariables
  >,
) {
  let [shoppingCartDiscountApply, { data, loading }] = useMutation<
    ShoppingCartDiscountCodeApply,
    ShoppingCartDiscountCodeApplyVariables
  >(SHOPPING_CART_DISCOUNT_CODE_APPLY, {
    ...options,
  });

  return {
    shoppingCartDiscountApply,
    data,
    loading,
  };
}

function useCheckoutDiscountRemove(
  options?: MutationHookOptions<
    ShoppingCartDiscountCodeRemove,
    ShoppingCartDiscountCodeRemoveVariables
  >,
) {
  let [shoppingCartDiscountRemove, { data, loading }] = useMutation<
    ShoppingCartDiscountCodeRemove,
    ShoppingCartDiscountCodeRemoveVariables
  >(SHOPPING_CART_DISCOUNT_CODE_REMOVE, {
    ...options,
  });

  return {
    shoppingCartDiscountRemove,
    data,
    loading,
  };
}

export {
  useCheckoutCreate,
  useCheckoutCustomerAssociate,
  useCheckoutDiscountApply,
  useCheckoutDiscountRemove,
  useCheckoutReplaceItem,
  useCheckoutUpdateAddress,
};
