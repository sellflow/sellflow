import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import { Text, ActivityIndicator } from 'exoflex';
import { useNavigation } from '@react-navigation/native';

import { KeyboardAvoidingView } from '../../core-ui';
import { COLORS } from '../../constants/colors';
import { OrderItem } from '../../components';
import { useDimensions, ScreenSize } from '../../helpers/dimensions';
import { StackNavProp } from '../../types/Navigation';
import { ShoppingCartCreate_checkoutCreate_checkout as CheckoutCreate } from '../../generated/server/ShoppingCartCreate';
import { ShoppingCartReplaceItem_checkoutLineItemsReplace_checkout as CheckoutReplace } from '../../generated/server/ShoppingCartReplaceItem';
import { ShoppingCartDiscountCodeApply_checkoutDiscountCodeApplyV2_checkout as CheckoutDiscountApply } from '../../generated/server/ShoppingCartDiscountCodeApply';
import {
  Cart,
  LineItem,
  OrderItem as OrderItemType,
  PaymentData,
} from '../../types/types';
import {
  useGetCart,
  useSetShoppingCartID,
  useSetShoppingCart,
} from '../../hooks/api/useShoppingCart';
import {
  useCheckoutCreate,
  useCheckoutCustomerAssociate,
  useCheckoutDiscountApply,
  useCheckoutDiscountRemove,
  useCheckoutReplaceItem,
} from '../../hooks/api/useShopifyCart';
import { cartPlaceholder } from '../../../assets/images';
import { mapToLineItems } from '../../helpers/mapToLineItems';
import Toast from '../../core-ui/Toast';
import { useAuth } from '../../helpers/useAuth';
import useDefaultCurrency from '../../hooks/api/useDefaultCurrency';
import { CheckoutErrorCode } from '../../generated/server/globalTypes';

import { ShoppingCartPayment, BottomButton } from './components';

function extractDataCheckout(
  checkout: CheckoutCreate | CheckoutReplace | CheckoutDiscountApply,
): Cart {
  let id = checkout.id;
  let lineItemsPrice = Number(checkout.lineItemsSubtotalPrice.amount);
  let subtotalPrice = Number(checkout.subtotalPriceV2.amount);
  let totalPrice = Number(checkout.paymentDueV2.amount);
  let lineItems: Array<LineItem> = mapToLineItems(checkout.lineItems);

  return {
    id,
    lineItems,
    lineItemsPrice,
    subtotalPrice,
    totalPrice,
  };
}

function mapLineItemsToOrder(
  items: Array<LineItem>,
  onChangeQuantity: (variantIDSearched: string, amount: number) => void,
  onRemovePress: (variantID: string) => void,
): Array<OrderItemType> {
  let result: Array<OrderItemType> = items.map(
    (item): OrderItemType => {
      return { ...item, onChangeQuantity, onRemovePress };
    },
  );
  return result;
}

export default function ShoppingCartScene() {
  let { authToken } = useAuth();
  let { screenSize } = useDimensions();
  let { navigate } = useNavigation<StackNavProp<'ShoppingCart'>>();
  let shoppingCartItems: Array<{ variantId: string; quantity: number }> = [];
  let [cartData, setCartData] = useState<Cart>({
    id: '',
    lineItemsPrice: 0,
    subtotalPrice: 0,
    totalPrice: 0,
    lineItems: [],
  });
  let [cartID, setCartID] = useState<string>('');
  let [firstLoading, setFirstLoading] = useState<boolean>(true);
  let [voucherCode, setVoucherCode] = useState<string>('');
  let [isToastVisible, setIsToastVisible] = useState<boolean>(false);
  let [isVoucherCodeValid, setIsVoucherCodeValid] = useState<boolean>(true);
  let { data } = useDefaultCurrency();

  let setVoucherCodeValue = (value: string) => {
    setVoucherCode(value);
  };

  let {
    shoppingCartDiscountApply,
    loading: DiscountCodeApplyLoading,
  } = useCheckoutDiscountApply({
    onCompleted: ({ checkoutDiscountCodeApplyV2 }) => {
      if (checkoutDiscountCodeApplyV2 && checkoutDiscountCodeApplyV2.checkout) {
        setCartData(extractDataCheckout(checkoutDiscountCodeApplyV2.checkout));
      }
    },
  });

  let { shoppingCartDiscountRemove } = useCheckoutDiscountRemove();

  let onAddVoucherCode = async () => {
    let result = await shoppingCartDiscountApply({
      variables: {
        checkoutId: cartID,
        discountCode: voucherCode,
        currencyCode: [data],
      },
    });

    let checkoutUserErrors =
      result.data?.checkoutDiscountCodeApplyV2?.checkoutUserErrors;

    if (checkoutUserErrors && checkoutUserErrors.length > 0) {
      if (checkoutUserErrors[0].code === CheckoutErrorCode.DISCOUNT_NOT_FOUND) {
        setIsVoucherCodeValid(false);
      }
    }
  };

  let paymentData: PaymentData = {
    subtotal: cartData.lineItemsPrice,
    total: cartData.subtotalPrice,
  };

  let showToast = (duration: number) => {
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, duration);
  };

  let changeItemQuantity = (variantIDSearched: string, amount: number) => {
    let newLineItemsData = cartData.lineItems.map((item) => {
      if (item.variantID === variantIDSearched) {
        return { ...item, quantity: amount };
      } else {
        return item;
      }
    });
    let newCartData = { ...cartData, lineItems: newLineItemsData };
    setCartData(newCartData);
    shoppingCartItems = newCartData.lineItems.map(({ variantID, quantity }) => {
      return { variantId: variantID, quantity };
    });
    setShoppingCart({ variables: { items: shoppingCartItems, id: cartID } });
    shoppingCartReplaceItems({
      variables: {
        lineItems: shoppingCartItems,
        checkoutID: cartID,
        currencyCode: [data],
      },
    });
  };

  let removeSelectedItem = async (variantID: string) => {
    if (replaceLoading) {
      return;
    }
    shoppingCartItems = cartData.lineItems
      .filter((item) => item.variantID !== variantID)
      .map(({ variantID, quantity }) => {
        return { variantId: variantID, quantity };
      });
    await shoppingCartReplaceItems({
      variables: {
        lineItems: shoppingCartItems,
        checkoutID: cartID,
      },
    });
    setShoppingCart({ variables: { items: shoppingCartItems, id: cartID } });
    showToast(1100);
  };

  let associateCustomerWithCart = async (id: string) => {
    if (authToken) {
      await shoppingCartCustomerAssociate({
        variables: { checkoutId: id, customerAccessToken: authToken },
      });
    }
  };

  useGetCart({
    fetchPolicy: 'cache-only',
    notifyOnNetworkStatusChange: true,
    onCompleted: async ({ shoppingCart }) => {
      setCartID(shoppingCart.id);
      if (shoppingCart.id === '') {
        createCheckout();
      } else {
        shoppingCartItems = shoppingCart.items.map(
          ({ variantId, quantity }) => {
            return { variantId, quantity };
          },
        );
        await shoppingCartDiscountRemove({
          variables: { checkoutId: shoppingCart.id },
        });
        await shoppingCartReplaceItems({
          variables: {
            checkoutID: shoppingCart.id,
            lineItems: shoppingCartItems,
            currencyCode: [data],
          },
        });
      }
    },
  });

  let { setShoppingCart } = useSetShoppingCart();
  let { setShoppingCartID } = useSetShoppingCartID();

  let {
    shoppingCartReplaceItems,
    loading: replaceLoading,
  } = useCheckoutReplaceItem({
    fetchPolicy: 'no-cache',
    onCompleted: async ({ checkoutLineItemsReplace }) => {
      if (checkoutLineItemsReplace && checkoutLineItemsReplace.checkout) {
        let shoppingCartItems = checkoutLineItemsReplace.checkout.lineItems.edges.map(
          ({ node }): { variantId: string; quantity: number } => {
            let { variant, quantity } = node;
            let variantId = variant ? variant.id : '';
            return {
              quantity,
              variantId,
            };
          },
        );

        if (checkoutLineItemsReplace.checkout.currencyCode !== data) {
          await createCheckout({
            variables: {
              checkoutCreateInput: {
                presentmentCurrencyCode: data,
                lineItems: shoppingCartItems,
              },
              currencyCode: [data],
            },
          });
          return;
        }
        setCartData(extractDataCheckout(checkoutLineItemsReplace.checkout));
        setFirstLoading(false);
      }
    },
  });

  let { shoppingCartCustomerAssociate } = useCheckoutCustomerAssociate();

  let { createCheckout } = useCheckoutCreate({
    variables: {
      checkoutCreateInput: { lineItems: shoppingCartItems },
    },
    onCompleted: async ({ checkoutCreate }) => {
      if (checkoutCreate && checkoutCreate.checkout) {
        let { id } = checkoutCreate.checkout;
        setCartID(id);
        await associateCustomerWithCart(id);
        setCartData(extractDataCheckout(checkoutCreate.checkout));
        await setShoppingCartID({
          variables: { id },
        });
        setFirstLoading(false);
      }
    },
  });

  let renderCartView = () => {
    return mapLineItemsToOrder(
      cartData.lineItems,
      changeItemQuantity,
      removeSelectedItem,
    ).map((item, index) => {
      return (
        <OrderItem
          cardType="checkout"
          orderItem={item}
          containerStyle={[styles.orderItem, index > 0 && styles.border]}
          key={item.variantID}
        />
      );
    });
  };

  let renderPaymentView = () => (
    <ShoppingCartPayment
      data={paymentData}
      onVoucherCodeChange={setVoucherCodeValue}
      voucherCode={voucherCode}
      onAddCode={onAddVoucherCode}
      applyLoading={DiscountCodeApplyLoading}
      isVoucherCodeValid={isVoucherCodeValid}
    />
  );

  if (firstLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (cartData.lineItems.length <= 0) {
    return (
      <SafeAreaView style={styles.flex}>
        <View style={styles.center}>
          <Image
            source={cartPlaceholder}
            width={100}
            height={100}
            style={styles.emptyCartImage}
          />
          <Text style={styles.opacity}>
            {t('Shopping cart is empty. Please add item to the cart.')}
          </Text>
        </View>
        <View
          style={
            screenSize === ScreenSize.Small
              ? styles.scrollContentSmall
              : styles.scrollContentMedium
          }
        >
          <BottomButton
            label={t('Back To Home')}
            onPressAction={() => navigate('Home')}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      {screenSize === ScreenSize.Large ? (
        <KeyboardAvoidingView>
          <SafeAreaView style={styles.horizontalLayout}>
            <ScrollView
              style={styles.flex}
              contentContainerStyle={styles.horizontalCart}
              contentInsetAdjustmentBehavior="automatic"
            >
              {renderCartView()}
            </ScrollView>
            <View style={styles.horizontalPaymentView}>
              {renderPaymentView()}
              <BottomButton
                label={t('Checkout')}
                onPressAction={() => navigate('Checkout', { cartData })}
              />
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      ) : (
        <SafeAreaView style={styles.flex}>
          <KeyboardAvoidingView>
            <ScrollView
              style={styles.flex}
              contentContainerStyle={[
                screenSize === ScreenSize.Small
                  ? styles.scrollContentSmall
                  : styles.scrollContentMedium,
                styles.flexGrow,
              ]}
            >
              {renderCartView()}
              <View style={styles.verticalPaymentView}>
                {renderPaymentView()}
                <BottomButton
                  label={t('checkout')}
                  onPressAction={() => navigate('Checkout', { cartData })}
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      )}
      <Toast
        data={{
          message: t('Item successfully removed'),
          isVisible: isToastVisible,
          mode: 'success',
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  flexGrow: {
    flexGrow: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  opacity: {
    opacity: 0.6,
  },
  horizontalLayout: {
    flexDirection: 'row',
    marginHorizontal: 36,
  },
  horizontalCart: {
    marginRight: 24,
  },
  horizontalPaymentView: {
    flex: 1,
    paddingTop: 24,
  },
  scrollContentSmall: {
    paddingHorizontal: 24,
  },
  scrollContentMedium: {
    paddingHorizontal: 36,
    paddingBottom: 24,
  },
  border: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGrey,
  },
  verticalPaymentView: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  emptyCartImage: {
    maxWidth: 360,
    maxHeight: 270,
    marginBottom: 24,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderItem: {
    paddingVertical: 24,
  },
});
