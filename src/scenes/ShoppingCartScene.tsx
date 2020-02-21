import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import { Text, Button, TextInput } from 'exoflex';
import { useNavigation } from '@react-navigation/native';

import { Surface } from '../core-ui';
import { FONT_SIZE } from '../constants/fonts';
import { COLORS } from '../constants/colors';
import { OrderItem } from '../components';
import { useDimensions, ScreenSize } from '../helpers/dimensions';
import formatCurrency from '../helpers/formatCurrency';
import { defaultButton, defaultButtonLabel } from '../constants/theme';
import { StackNavProp } from '../types/Navigation';
import { ShoppingCartCreate_checkoutCreate_checkout as CheckoutCreate } from '../generated/server/ShoppingCartCreate';
import { ShoppingCartReplaceItem_checkoutLineItemsReplace_checkout as CheckoutReplace } from '../generated/server/ShoppingCartReplaceItem';
import { Cart, LineItem, OrderItem as OrderItemType } from '../types/types';
import {
  useGetCart,
  useSetShoppingCartID,
  useSetShoppingCart,
} from '../hooks/api/useShoppingCart';
import {
  useShopifyCreateCheckout,
  useShopifyShoppingCartReplaceItems,
} from '../hooks/api/useShopifyCart';
import { cartPlaceholder } from '../../assets/images';
import { mapToLineItems } from '../helpers/mapToLineItems';
import Toast from '../core-ui/Toast';

function extractDataCheckout(checkout: CheckoutCreate | CheckoutReplace): Cart {
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

type BottomButtonProps = {
  label: string;
  onPressAction: () => void;
};
function BottomButton(props: BottomButtonProps) {
  let { label, onPressAction } = props;
  return (
    <Button
      style={defaultButton}
      labelStyle={defaultButtonLabel}
      onPress={onPressAction}
    >
      {label}
    </Button>
  );
}

export default function ShoppingCartScene() {
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
  let [cartID, setCartID] = useState('');

  let [isToastVisible, setIsToastVisible] = useState<boolean>(false);

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
    setShoppingCart({ variables: { items: shoppingCartItems } });
    shoppingCartReplaceItems({
      variables: {
        lineItems: shoppingCartItems,
        checkoutID: cartID,
      },
    });
  };

  let removeSelectedItem = (variantID: string) => {
    shoppingCartItems = cartData.lineItems
      .filter((item) => item.variantID !== variantID)
      .map(({ variantID, quantity }) => {
        return { variantId: variantID, quantity };
      });
    setShoppingCart({ variables: { items: shoppingCartItems } });
    shoppingCartReplaceItems({
      variables: {
        lineItems: shoppingCartItems,
        checkoutID: cartID,
      },
    });
    showToast(1100);
  };

  useGetCart({
    fetchPolicy: 'cache-only',
    notifyOnNetworkStatusChange: true,
    onCompleted({ shoppingCart }) {
      setCartID(shoppingCart.id);
      if (shoppingCart.id === '') {
        createCheckout();
      } else {
        shoppingCartItems = shoppingCart.items.map(
          ({ variantId, quantity }) => {
            return { variantId, quantity };
          },
        );
        shoppingCartReplaceItems({
          variables: {
            checkoutID: shoppingCart.id,
            lineItems: shoppingCartItems,
          },
        });
      }
    },
  });

  let { setShoppingCart } = useSetShoppingCart();
  let { setShoppingCartID } = useSetShoppingCartID();

  let { shoppingCartReplaceItems } = useShopifyShoppingCartReplaceItems({
    onCompleted: ({ checkoutLineItemsReplace }) => {
      if (checkoutLineItemsReplace && checkoutLineItemsReplace.checkout) {
        setCartData(extractDataCheckout(checkoutLineItemsReplace.checkout));
      }
    },
  });

  let { createCheckout } = useShopifyCreateCheckout({
    variables: {
      checkoutCreateInput: { lineItems: shoppingCartItems },
    },
    onCompleted({ checkoutCreate }) {
      if (checkoutCreate && checkoutCreate.checkout) {
        setCartData(extractDataCheckout(checkoutCreate.checkout));
        setShoppingCartID({ variables: { id: checkoutCreate.checkout.id } });
      }
    },
  });

  let renderCartView = () => {
    return mapLineItemsToOrder(
      cartData.lineItems,
      changeItemQuantity,
      removeSelectedItem,
    ).map((item, index) => (
      <OrderItem
        cardType="checkout"
        orderItem={item}
        containerStyle={[styles.orderItem, index > 0 && styles.border]}
        key={item.variantID}
      />
    ));
  };

  let renderPaymentView = () => <Payment data={paymentData} />;

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
      ) : (
        <SafeAreaView style={styles.flex}>
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

type PaymentProps = {
  data: PaymentData;
};
type PaymentData = {
  total: number;
  subtotal: number;
};

function Payment(props: PaymentProps) {
  let { total, subtotal } = props.data;
  return (
    <>
      <View style={styles.voucherCodeContainer}>
        <Text style={styles.opacity}>{t('Voucher code or giftcard')}</Text>
        <View style={styles.voucherInputButtonContainer}>
          <TextInput
            containerStyle={styles.voucherTextInputContainer}
            autoCapitalize="none"
            returnKeyType="done"
          />
          <Button
            style={defaultButton}
            contentStyle={styles.addButton}
            labelStyle={defaultButtonLabel}
          >
            {t('Add')}
          </Button>
        </View>
      </View>
      <Surface containerStyle={styles.surfacePaymentDetails}>
        <View style={styles.paymentDetailsContainer}>
          <Text style={styles.mediumText}>{t('Subtotal')}</Text>
          <Text style={styles.mediumText}>{formatCurrency(subtotal)}</Text>
        </View>
        <View style={styles.paymentDetailsContainer}>
          <Text style={styles.mediumText}>{t('Discount')}</Text>
          <Text style={styles.mediumText}>
            -{formatCurrency(total - subtotal)}
          </Text>
        </View>
        <View style={[styles.paymentDetailsContainer, styles.border]}>
          <Text style={styles.mediumText}>{t('Total')}</Text>
          <Text weight="bold" style={styles.mediumText}>
            {formatCurrency(total)}
          </Text>
        </View>
      </Surface>
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
  },
  voucherCodeContainer: {
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
  },
  voucherTextInputContainer: {
    flexGrow: 1,
    height: 48,
    borderColor: COLORS.lightGrey,
    borderWidth: 1,
    marginRight: 16,
  },
  voucherInputButtonContainer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentDetailsContainer: {
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  surfacePaymentDetails: {
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 15,
  },
  orderItem: {
    paddingVertical: 24,
  },
  mediumText: {
    fontSize: FONT_SIZE.medium,
  },
  addButton: {
    maxWidth: 88,
    minWidth: 88,
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
});
