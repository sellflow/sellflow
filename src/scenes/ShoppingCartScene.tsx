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
} from '../helpers/queriesAndMutations/useShopifyCart';
import { cartPlaceholder } from '../../assets/images';

function extractDataCheckout(checkout: CheckoutCreate | CheckoutReplace): Cart {
  let id = checkout.id;
  let lineItemsPrice = parseFloat(checkout.lineItemsSubtotalPrice.amount);
  let subtotalPrice = parseFloat(checkout.subtotalPriceV2.amount);
  let totalPrice = parseFloat(checkout.paymentDueV2.amount);
  let lineItems: Array<LineItem> = checkout.lineItems.edges.map(
    ({ node }): LineItem => {
      let { quantity, discountAllocations, title, variant } = node;
      let images = '';
      let priceAfterDiscount = 0;
      let originalPrice = 0;
      let variantID = '';
      let variants = '';
      if (variant) {
        let { compareAtPriceV2, image, priceV2, id, selectedOptions } = variant;
        variantID = id;
        let index = 0;
        for (let option in selectedOptions) {
          if (index % 2 === 1) {
            variants += `, ${selectedOptions[option].name} ${selectedOptions[option].value}`;
            index += 1;
          } else {
            variants += `${selectedOptions[option].name} ${selectedOptions[option].value}`;
            index += 1;
          }
        }
        if (image) {
          images = image.transformedSrc;
          if (discountAllocations.length === 0) {
            priceAfterDiscount = compareAtPriceV2
              ? parseFloat(priceV2.amount)
              : 0;
          } else {
            priceAfterDiscount = parseFloat(
              discountAllocations[0].allocatedAmount.amount,
            );
          }
        }
        if (compareAtPriceV2) {
          originalPrice = parseFloat(compareAtPriceV2.amount);
        } else {
          originalPrice = parseFloat(priceV2.amount);
        }
      }

      return {
        variant: variants,
        variantID,
        title,
        image: images,
        originalPrice,
        priceAfterDiscount,
        quantity,
      };
    },
  );
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
    ({
      image,
      title,
      quantity,
      priceAfterDiscount,
      originalPrice,
      variant,
      variantID,
    }): OrderItemType => {
      return {
        cardType: 'checkout',
        imageURL: image,
        itemName: title,
        itemPrice: originalPrice,
        priceAfterDiscount,
        quantity,
        onChangeQuantity,
        onRemovePress,
        variant,
        variantID,
      };
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
      {t(label)}
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

  let paymentData: PaymentData = {
    subtotal: cartData.lineItemsPrice,
    total: cartData.subtotalPrice,
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

  let renderCartView = () => (
    <View style={styles.cartContainer}>
      <View style={styles.orderItemContainer}>
        {mapLineItemsToOrder(
          cartData.lineItems,
          changeItemQuantity,
          removeSelectedItem,
        ).map((item, index) => (
          <View key={item.variantID}>
            {index > 0 ? <View style={styles.productSeparator} /> : null}
            <OrderItem
              orderItem={item}
              containerStyle={styles.orderItem}
              key={item.variantID}
            />
          </View>
        ))}
      </View>
    </View>
  );

  let renderPaymentView = () => <Payment data={paymentData} />;

  if (cartData.lineItems.length <= 0) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Image
            source={cartPlaceholder}
            width={100}
            height={100}
            style={{ maxWidth: 360, maxHeight: 270, marginBottom: 24 }}
          />
          <Text style={{ fontSize: FONT_SIZE.small, opacity: 0.6 }}>
            {t('Shopping cart is empty. Please add item to the cart.')}
          </Text>
        </View>
        <View style={{ paddingVertical: 10, paddingHorizontal: 15 }}>
          <BottomButton
            label={t('Back to home')}
            onPressAction={() => navigate('Home')}
          />
        </View>
      </SafeAreaView>
    );
  }

  return screenSize === ScreenSize.Large ? (
    <View style={styles.horizontalLayout}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        contentInsetAdjustmentBehavior="automatic"
      >
        {renderCartView()}
      </ScrollView>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ paddingTop: 15, paddingHorizontal: 15 }}>
          {renderPaymentView()}
          <BottomButton
            label={t('checkout')}
            onPressAction={() => navigate('Checkout')}
          />
        </View>
      </SafeAreaView>
    </View>
  ) : (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={
          screenSize === ScreenSize.Small
            ? styles.scrollContentSmall
            : styles.scrollContentMedium
        }
      >
        {renderCartView()}
        {renderPaymentView()}
      </ScrollView>
      <View style={{ paddingVertical: 10, paddingHorizontal: 15 }}>
        <BottomButton
          label={t('checkout')}
          onPressAction={() => navigate('Checkout')}
        />
      </View>
    </SafeAreaView>
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
        <Text style={styles.textLabel}>{t('Voucher code or giftcard')}</Text>
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
        <View style={styles.innerPaymentDetailsContainer}>
          <Text style={styles.paymentDetailLabel}>{t('Subtotal')}</Text>
          <Text style={styles.mediumText}>{formatCurrency(subtotal)}</Text>
        </View>
        <View style={styles.innerPaymentDetailsContainer}>
          <Text style={styles.paymentDetailLabel}>{t('Discount')}</Text>
          <Text style={styles.mediumText}>
            -{formatCurrency(total - subtotal)}
          </Text>
        </View>
        <View
          style={[
            styles.innerPaymentDetailsContainer,
            {
              borderTopWidth: 1,
              borderColor: COLORS.lightGrey,
            },
          ]}
        >
          <Text style={styles.paymentDetailLabel}>{t('Total')}</Text>
          <Text weight="bold" style={styles.mediumText}>
            {formatCurrency(total)}
          </Text>
        </View>
      </Surface>
    </>
  );
}

const styles = StyleSheet.create({
  horizontalLayout: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    alignItems: 'stretch',
  },
  scrollContentSmall: {
    paddingHorizontal: 24,
  },
  scrollContentMedium: {
    paddingHorizontal: 36,
  },
  voucherCodeContainer: {
    padding: 12,
    borderWidth: 0.5,
    borderColor: COLORS.grey,
    marginVertical: 2,
  },
  voucherTextInputContainer: {
    flexGrow: 2,
    height: 48,
    borderRadius: 0,
    borderColor: COLORS.grey,
    borderWidth: 0.5,
    marginRight: 24,
  },
  voucherInputButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cartContainer: {
    flexDirection: 'column',
    marginVertical: 2,
  },
  orderItemContainer: {
    marginVertical: 7,
  },
  innerPaymentDetailsContainer: {
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
    paddingVertical: 7,
  },
  textLabel: {
    color: COLORS.grey,
    fontSize: FONT_SIZE.small,
    marginBottom: 12,
  },
  mediumText: {
    fontSize: FONT_SIZE.medium,
  },
  paymentDetailLabel: {
    fontSize: FONT_SIZE.medium,
    marginBottom: 6,
  },
  addButton: {
    maxWidth: 88,
    minWidth: 88,
  },
  productSeparator: {
    borderWidth: 0.5,
    borderColor: COLORS.lightGrey,
  },
});
