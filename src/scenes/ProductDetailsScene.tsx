import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Text, IconButton, Button } from 'exoflex';

import { COLORS } from '../constants/colors';
import { FONT_SIZE } from '../constants/fonts';
import { useDimensions, ScreenSize } from '../helpers/dimensions';
import { TabView, RichRadioGroup } from '../core-ui';
import { TabRoute } from '../core-ui/TabView';

type ProductVariant = {
  name: string;
  values: Array<string>;
};

type ProductDetailsProps = {
  isWishlistActive: boolean;
  onWishlistPress: (value: boolean) => void;
};

const data = [
  { name: 'Size', values: ['S', 'M', 'L', 'XL'] },
  {
    name: 'Color',
    values: ['Brown', 'Blue', 'Black', 'Red', 'Green', 'Yellow'],
  },
];

function Description() {
  return (
    <View style={[styles.padding, styles.flex]}>
      <Text>
        Lightweight jacket padded shirt collar and long sleeves. Paspoal model
        front pockets. Elastic at the end. Front cover with zipper.
      </Text>
    </View>
  );
}

function Material() {
  return (
    <View style={[styles.padding, styles.flex]}>
      <Text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </Text>
    </View>
  );
}

const routes: Array<TabRoute> = [
  { key: 'description', title: 'Description', scene: Description },
  { key: 'material', title: 'Material & Care', scene: Material },
];

function onPressShare() {
  // NOTE: Remove this later
  // eslint-disable-next-line no-console
  console.log('Shared!');
}

function onPressAddToCart() {
  // NOTE: Remove this later
  // eslint-disable-next-line no-console
  console.log('Added to Cart!');
}

function RadioGroupWithState(props: ProductVariant) {
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

function RadioGroupContainer() {
  return (
    <>
      <View style={styles.padding}>
        <Text style={styles.productInfoTitle}>{'Corduroy Trucker'}</Text>
        <Text weight="bold" style={styles.productInfoPrice}>
          {'$ 59.00'}
        </Text>
      </View>

      {data.map((item, index) => (
        <RadioGroupWithState
          key={index}
          name={item.name}
          values={item.values}
        />
      ))}

      <TabView routes={routes} />
    </>
  );
}

function BottomAction(props: ProductDetailsProps) {
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
          onPress={onPressShare}
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
      <Button style={styles.flex} onPress={onPressAddToCart}>
        <Text weight="medium" style={styles.buttonTextStyle}>
          {t('Add to Cart')}
        </Text>
      </Button>
    </>
  );
}

function ProductDetailsLandscape(props: ProductDetailsProps) {
  let { isWishlistActive, onWishlistPress } = props;

  return (
    <SafeAreaView style={[styles.flex, styles.flexRow]}>
      <View style={styles.flex}>
        <Image
          source={{
            uri:
              'https://cdn.shopify.com/s/files/1/0130/1012/products/champion-logo-hood-black-1_2048x2048.jpg?v=1555275033',
          }}
          style={styles.flex}
          resizeMode="cover"
        />
      </View>

      <View style={styles.flex}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flexColumn}
        >
          <RadioGroupContainer />
        </ScrollView>
        <View style={[styles.bottomContainer, styles.bottomLandscapeContainer]}>
          <BottomAction
            isWishlistActive={isWishlistActive}
            onWishlistPress={onWishlistPress}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function ProductDetailsPortrait(props: ProductDetailsProps) {
  let { isWishlistActive, onWishlistPress } = props;

  let dimensions = useDimensions();

  return (
    <>
      <ScrollView style={styles.flex}>
        <Image
          source={{
            uri:
              'https://cdn.shopify.com/s/files/1/0130/1012/products/champion-logo-hood-black-1_2048x2048.jpg?v=1555275033',
          }}
          style={{
            height: dimensions.screenSize === ScreenSize.Small ? 320 : 576,
          }}
          resizeMode="cover"
        />
        <View style={styles.flex}>
          <RadioGroupContainer />
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <BottomAction
          isWishlistActive={isWishlistActive}
          onWishlistPress={onWishlistPress}
        />
      </View>
    </>
  );
}

export default function ProductDetailsScene() {
  let dimensions = useDimensions();

  let [isWishlistActive, setWishlistActive] = useState(false);

  return (
    <View style={styles.flex}>
      {dimensions.screenSize === ScreenSize.Large ? (
        <ProductDetailsLandscape
          isWishlistActive={isWishlistActive}
          onWishlistPress={(isActive) => {
            setWishlistActive(isActive);
          }}
        />
      ) : (
        <ProductDetailsPortrait
          isWishlistActive={isWishlistActive}
          onWishlistPress={(isActive) => {
            setWishlistActive(isActive);
          }}
        />
      )}
    </View>
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
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
  },
  bottomLandscapeContainer: {
    marginHorizontal: 36,
    marginBottom: 24,
  },
  bottomIconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginRight: 12,
  },
  buttonTextStyle: {
    marginTop: 5,
    color: COLORS.white,
    fontSize: FONT_SIZE.medium,
  },
});
