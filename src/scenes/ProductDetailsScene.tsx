import React, { useState } from 'react';
import { StyleSheet, View, Image, ScrollView, Alert } from 'react-native';
import { Text, IconButton, Button, ActivityIndicator } from 'exoflex';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useQuery } from '@apollo/react-hooks';

import { COLORS } from '../constants/colors';
import { FONT_SIZE } from '../constants/fonts';
import { defaultButton, defaultButtonLabel } from '../constants/theme';
import { useDimensions, ScreenSize } from '../helpers/dimensions';
import formatCurrency from '../helpers/formatCurrency';
import { TabView, RichRadioGroup } from '../core-ui';
import { TabRoute } from '../core-ui/TabView';
import { Product } from '../types/types';
import { StackRouteProp } from '../types/Navigation';
import {
  GetProductByHandle,
  GetProductByHandleVariables,
} from '../generated/server/GetProductByHandle';
import { GET_PRODUCT_BY_HANDLE } from '../graphql/server/productByHandle';

type ProductDetailsProps = {
  product: Product;
  options?: Options;
  infoTabs?: Tabs;
  isWishlistActive: boolean;
  onWishlistPress: (value: boolean) => void;
};

type Options = Array<{ name: string; values: Array<string> }>;

type Tabs = Array<{ title: string; content: string }>;

function infoTabRoutes(infoTabs: Tabs): Array<TabRoute> {
  return infoTabs.map(({ title, content }, i) => ({
    key: i.toString(),
    title,
    scene: () => <TabPane content={content} />,
  }));
}

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

function ProductInfo(props: {
  product: Product;
  options: Options;
  infoTabs: Tabs;
}) {
  let { product, options, infoTabs } = props;

  return (
    <>
      <View style={styles.padding}>
        <Text style={styles.productInfoTitle}>{product.title}</Text>
        <Text weight="bold" style={styles.productInfoPrice}>
          {formatCurrency(product.price)}
        </Text>
      </View>

      {options.map((item, index) => (
        <RadioGroupWithState
          key={index}
          name={item.name}
          values={item.values}
        />
      ))}

      <TabView routes={infoTabRoutes(infoTabs)} />
    </>
  );
}

function BottomActionBar(props: ProductDetailsProps) {
  let { isWishlistActive, onWishlistPress } = props;
  let { navigate } = useNavigation();

  let onPressWishlist = () => {
    onWishlistPress(!isWishlistActive);
  };

  return (
    <View style={styles.bottomIconContainer}>
      <IconButton
        icon="share-variant"
        color={COLORS.primaryColor}
        onPress={() => {}}
        style={styles.icon}
      />
      {isWishlistActive ? (
        <IconButton
          icon="heart"
          color={COLORS.wishlist}
          onPress={onPressWishlist}
          style={styles.icon}
        />
      ) : (
        <IconButton
          icon="heart-outline"
          onPress={onPressWishlist}
          style={styles.icon}
        />
      )}
      <Button
        style={[defaultButton, styles.flex]}
        labelStyle={defaultButtonLabel}
        onPress={() => navigate('ShoppingCart')}
      >
        {t('Add to Cart')}
      </Button>
    </View>
  );
}

function ProductDetailsLandscape(props: ProductDetailsProps) {
  let { product, options, infoTabs } = props;

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
          <ProductInfo
            product={product}
            options={options ? options : []}
            infoTabs={infoTabs ? infoTabs : []}
          />
        </ScrollView>
        <View style={[styles.bottomContainer, styles.bottomLandscapeContainer]}>
          <BottomActionBar {...props} />
        </View>
      </View>
    </View>
  );
}

function ProductDetailsPortrait(props: ProductDetailsProps) {
  let { product, options, infoTabs } = props;
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
          <ProductInfo
            product={product}
            options={options ? options : []}
            infoTabs={infoTabs ? infoTabs : []}
          />
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
  let [options, setOptions] = useState<Options>([]);
  let [infoTabs, setInfoTabs] = useState<Tabs>([
    { title: 'Description', content: '' },
  ]);

  let { loading, data } = useQuery<
    GetProductByHandle,
    GetProductByHandleVariables
  >(GET_PRODUCT_BY_HANDLE, {
    fetchPolicy: 'network-only',
    onCompleted({ productByHandle }) {
      if (productByHandle) {
        setOptions([...options, ...productByHandle.options]);
        setInfoTabs([
          ...[{ title: 'Description', content: productByHandle.description }],
        ]);
      }
    },
    onError(error) {
      let newError = error.message.split(':');
      Alert.alert(newError[1]);
    },
    variables: {
      productHandle: product.handle,
    },
  });

  return loading || !data ? (
    <View style={styles.centered}>
      <ActivityIndicator size="large" />
    </View>
  ) : dimensions.screenSize === ScreenSize.Large ? (
    <ProductDetailsLandscape
      product={product}
      options={options}
      infoTabs={infoTabs}
      isWishlistActive={isWishlistActive}
      onWishlistPress={(isActive) => {
        setWishlistActive(isActive);
      }}
    />
  ) : (
    <ProductDetailsPortrait
      product={product}
      options={options}
      infoTabs={infoTabs}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 12,
  },
  bottomLandscapeContainer: {
    marginHorizontal: 36,
    marginBottom: 24,
  },
  bottomIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 14,
  },
});
