import React, { useState } from 'react';
import { StyleSheet, View, Image, ScrollView } from 'react-native';
import { Text, IconButton, Button } from 'exoflex';

import { COLORS } from '../constants/colors';
import { FONT_SIZE } from '../constants/fonts';
import { useDimensions, ScreenSize } from '../helpers/dimensions';
import { TabView, RichRadioGroup } from '../core-ui';
import { TabRoute } from '../core-ui/TabView';
import formatCurrency from '../helpers/formatCurrency';
import { Product } from '../types/types';
import { useRoute } from '@react-navigation/native';
import { StackRouteProp } from '../types/Navigation';
import { defaultButton, defaultButtonLabel } from '../constants/theme';

type ProductDetailsProps = {
  product: Product;
  isWishlistActive: boolean;
  onWishlistPress: (value: boolean) => void;
};

const variants = [
  { name: 'Size', values: ['S', 'M', 'L', 'XL'] },
  {
    name: 'Color',
    values: ['Brown', 'Blue', 'Black', 'Red', 'Green', 'Yellow'],
  },
];

const infoTabs = [
  {
    title: 'Description',
    content:
      'Lightweight jacket padded shirt collar and long sleeves. Paspoal model front pockets. Elastic at the end. Front cover with zipper.',
  },
  {
    title: 'Material & Care',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
];

const infoTabRoutes: Array<TabRoute> = infoTabs.map(
  ({ title, content }, i) => ({
    key: i.toString(),
    title,
    scene: () => <TabPane content={content} />,
  }),
);

function TabPane(props: { content: string }) {
  return (
    <View style={[styles.padding, styles.flex]}>
      <Text>{props.content}</Text>
    </View>
  );
}

function RadioGroupWithState(props: { name: string; values: Array<string> }) {
  let { name, values } = props;
  let [selectedValue, setSelectedValue] = useState(values[0]);
  return (
    <RichRadioGroup
      name={name}
      values={values}
      selectedValue={selectedValue}
      onSelect={(value) => setSelectedValue(value)}
    />
  );
}

function ProductInfo(props: { product: Product }) {
  let { product } = props;
  return (
    <>
      <View style={styles.padding}>
        <Text style={styles.productInfoTitle}>{product.name}</Text>
        <Text weight="bold" style={styles.productInfoPrice}>
          {formatCurrency(product.price)}
        </Text>
      </View>

      {variants.map((item, index) => (
        <RadioGroupWithState
          key={index}
          name={item.name}
          values={item.values}
        />
      ))}

      <TabView routes={infoTabRoutes} />
    </>
  );
}

function BottomActionBar(props: ProductDetailsProps) {
  let { isWishlistActive, onWishlistPress } = props;

  let onPressWishlist = () => {
    onWishlistPress(!isWishlistActive);
  };

  return (
    <>
      <View style={styles.bottomIconContainer}>
        <IconButton
          icon="share-variant"
          color={COLORS.primaryColor}
          onPress={() => {}}
        />
        {isWishlistActive ? (
          <IconButton
            icon="heart"
            color={COLORS.wishlist}
            onPress={onPressWishlist}
          />
        ) : (
          <IconButton icon="heart-outline" onPress={onPressWishlist} />
        )}
      </View>
      <Button
        style={[defaultButton, styles.flex]}
        labelStyle={defaultButtonLabel}
        onPress={() => {}}
      >
        {t('Add to Cart')}
      </Button>
    </>
  );
}

function ProductDetailsLandscape(props: ProductDetailsProps) {
  let { product } = props;
  return (
    <View style={[styles.flex, styles.flexRow]}>
      <View style={styles.flex}>
        <Image
          source={{ uri: product.image }}
          style={styles.flex}
          resizeMode="cover"
        />
      </View>

      <View style={styles.flex}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flexColumn}
        >
          <ProductInfo product={product} />
        </ScrollView>
        <View style={[styles.bottomContainer, styles.bottomLandscapeContainer]}>
          <BottomActionBar {...props} />
        </View>
      </View>
    </View>
  );
}

function ProductDetailsPortrait(props: ProductDetailsProps) {
  let { product } = props;
  let dimensions = useDimensions();
  return (
    <>
      <ScrollView style={styles.flex}>
        <Image
          source={{ uri: product.image }}
          style={{
            height: dimensions.screenSize === ScreenSize.Small ? 320 : 576,
          }}
          resizeMode="cover"
        />
        <View style={styles.flex}>
          <ProductInfo product={product} />
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <BottomActionBar {...props} />
      </View>
    </>
  );
}

export default function ProductDetailsScene() {
  let dimensions = useDimensions();
  let route = useRoute<StackRouteProp<'ProductDetails'>>();
  let { product } = route.params;

  let [isWishlistActive, setWishlistActive] = useState(false);

  return dimensions.screenSize === ScreenSize.Large ? (
    <ProductDetailsLandscape
      product={product}
      isWishlistActive={isWishlistActive}
      onWishlistPress={(isActive) => {
        setWishlistActive(isActive);
      }}
    />
  ) : (
    <ProductDetailsPortrait
      product={product}
      isWishlistActive={isWishlistActive}
      onWishlistPress={(isActive) => {
        setWishlistActive(isActive);
      }}
    />
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  padding: {
    padding: 24,
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexColumn: {
    flexDirection: 'column',
  },
  productInfoTitle: {
    marginBottom: 8,
    fontSize: FONT_SIZE.medium,
  },
  productInfoPrice: {
    fontSize: FONT_SIZE.large,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGrey,
  },
  bottomLandscapeContainer: {
    marginHorizontal: 36,
    marginBottom: 24,
  },
  bottomIconContainer: {
    flexDirection: 'row',
    marginTop: 5,
    marginRight: 12,
  },
});
