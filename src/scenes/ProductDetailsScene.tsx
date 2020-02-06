import React, { useState } from 'react';
import { StyleSheet, View, Image, ScrollView, Alert } from 'react-native';
import {
  Text,
  IconButton,
  Button,
  ActivityIndicator,
  TextInput,
} from 'exoflex';
import { useRoute } from '@react-navigation/native';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';

import { COLORS } from '../constants/colors';
import { FONT_SIZE } from '../constants/fonts';
import { defaultButton, defaultButtonLabel } from '../constants/theme';
import { useDimensions, ScreenSize } from '../helpers/dimensions';
import formatCurrency from '../helpers/formatCurrency';
import { TabView, RichRadioGroup } from '../core-ui';
import { TabRoute } from '../core-ui/TabView';
import { Product, VariantQueryData } from '../types/types';
import { StackRouteProp } from '../types/Navigation';
import {
  GetProductByHandle,
  GetProductByHandleVariables,
} from '../generated/server/GetProductByHandle';
import {
  AddToWishlist,
  AddToWishlistVariables,
} from '../generated/client/AddToWishlist';
import {
  GET_PRODUCT_BY_HANDLE,
  GET_PRODUCT_VARIANT_ID,
} from '../graphql/server/productByHandle';
import {
  ADD_TO_WISHLIST,
  GET_WISHLIST,
  REMOVE_FROM_WISHLIST,
} from '../graphql/client/clientQueries';
import { GetWishlist } from '../generated/client/GetWishlist';
import {
  RemoveFromWishlist,
  RemoveFromWishlistVariables,
} from '../generated/client/RemoveFromWishlist';

import { ADD_TO_SHOPPING_CART } from '../graphql/client/shoppingCartQueries';

import {
  AddToShoppingCart,
  AddToShoppingCartVariables,
} from '../generated/client/AddToShoppingCart';
import { valueBetweenZeroToMax } from '../helpers/valueBetweenZeroToMax';
import {
  GetProductVariantID,
  GetProductVariantIDVariables,
} from '../generated/server/GetProductVariantID';

type ProductDetailsProps = {
  onSelectionOptionChange: (key: string, value: string) => void;
  selectedOptions: OptionsData;
  quantity: number;
  onChangeQuantity: React.Dispatch<React.SetStateAction<number>>;
  product: Product;
  options?: Options;
  infoTabs?: Tabs;
  isWishlistActive: boolean;
  onAddToCartPress: () => void;
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

function ProductInfo(props: {
  onSelectionOptionChange: (key: string, value: string) => void;
  selectedOptions: OptionsData;
  quantity: number;
  onChangeQuantity: React.Dispatch<React.SetStateAction<number>>;
  product: Product;
  options: Options;
  infoTabs: Tabs;
}) {
  let {
    product,
    options,
    infoTabs,
    quantity,
    selectedOptions,
    onChangeQuantity,
    onSelectionOptionChange,
  } = props;
  let radioGroupRenderView = options.map(({ name, values }) => {
    return (
      <RichRadioGroup
        key={name}
        name={name}
        values={values}
        selectedValue={selectedOptions[name]}
        onSelect={(value) => {
          onSelectionOptionChange(name, value);
        }}
      />
    );
  });
  return (
    <>
      <View style={styles.padding}>
        <Text style={styles.productInfoTitle}>{product.title}</Text>
        <Text weight="bold" style={styles.productInfoPrice}>
          {formatCurrency(product.price)}
        </Text>
      </View>

      {radioGroupRenderView}
      <View style={{ paddingHorizontal: 24 }}>
        <Text
          style={{ opacity: 0.6, fontSize: FONT_SIZE.small, marginBottom: 12 }}
        >
          Quantity
        </Text>
        <TextInput
          containerStyle={{ width: 80, height: 48 }}
          value={quantity.toString()}
          onBlur={() => {
            if (quantity === 0) {
              onChangeQuantity(1);
            }
          }}
          onChangeText={(value) =>
            onChangeQuantity(valueBetweenZeroToMax(parseInt(value, 10), 100))
          }
        />
      </View>
      <TabView routes={infoTabRoutes(infoTabs)} />
    </>
  );
}

function BottomActionBar(props: ProductDetailsProps) {
  let [addToWishlist] = useMutation<AddToWishlist, AddToWishlistVariables>(
    ADD_TO_WISHLIST,
  );

  let [removeFromWishlist] = useMutation<
    RemoveFromWishlist,
    RemoveFromWishlistVariables
  >(REMOVE_FROM_WISHLIST);
  let { isWishlistActive, onWishlistPress, onAddToCartPress, product } = props;

  let onPressWishlist = () => {
    onWishlistPress(!isWishlistActive);

    if (isWishlistActive === false) {
      addToWishlist({ variables: { product } });
    } else {
      removeFromWishlist({ variables: { productHandle: product.handle } });
    }
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
        onPress={() => {
          onAddToCartPress();
        }}
      >
        {t('Add to Cart')}
      </Button>
    </View>
  );
}

function ProductDetailsLandscape(props: ProductDetailsProps) {
  let {
    product,
    options,
    infoTabs,
    quantity,
    onChangeQuantity,
    onSelectionOptionChange,
    selectedOptions,
  } = props;

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
            selectedOptions={selectedOptions}
            onSelectionOptionChange={onSelectionOptionChange}
            quantity={quantity}
            onChangeQuantity={onChangeQuantity}
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
  let {
    product,
    options,
    infoTabs,
    quantity,
    selectedOptions,
    onChangeQuantity,
    onSelectionOptionChange,
  } = props;
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
            selectedOptions={selectedOptions}
            onSelectionOptionChange={onSelectionOptionChange}
            quantity={quantity}
            onChangeQuantity={onChangeQuantity}
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

type OptionsData = {
  [id: string]: string;
};

export default function ProductDetailsScene() {
  let dimensions = useDimensions();
  let route = useRoute<StackRouteProp<'ProductDetails'>>();
  let { product } = route.params;

  let [addToCart] = useMutation<AddToShoppingCart, AddToShoppingCartVariables>(
    ADD_TO_SHOPPING_CART,
  );

  let [isWishlistActive, setWishlistActive] = useState(false);
  let [options, setOptions] = useState<Options>([]);
  let [quantity, setQuantity] = useState(1);
  let [selectedOptions, setSelectedOptions] = useState<OptionsData>({});
  let [infoTabs, setInfoTabs] = useState<Tabs>([
    { title: 'Description', content: '' },
  ]);

  let extractOptionsData = (
    optionsData: OptionsData,
  ): Array<VariantQueryData> => {
    let result: Array<VariantQueryData> = [];

    for (let option in optionsData) {
      if (option) {
        let processedForm: VariantQueryData = {
          name: option,
          value: optionsData[option],
        };
        result.push(processedForm);
      }
    }
    return result;
  };

  let changeSelectedOptions = (key: string, value: string) => {
    setSelectedOptions({ ...selectedOptions, [key]: value });
  };

  let [getVariantID] = useLazyQuery<
    GetProductVariantID,
    GetProductVariantIDVariables
  >(GET_PRODUCT_VARIANT_ID, {
    onCompleted: ({ productByHandle }) => {
      if (productByHandle && productByHandle.variantBySelectedOptions) {
        let { id } = productByHandle.variantBySelectedOptions;
        addToCart({ variables: { variantId: id, quantity } });
      }
    },
  });

  let { data: wishlistData } = useQuery<GetWishlist>(GET_WISHLIST, {
    onCompleted: ({ wishlist }) => {
      if (wishlist.find((item) => item.handle === product.handle)) {
        setWishlistActive(true);
      }
    },
  });

  let onAddToCart = () => {
    let queryVariantID = extractOptionsData(selectedOptions);
    getVariantID({
      variables: { selectedOptions: queryVariantID, handle: product.handle },
    });

    // addToCart({ variables: { variantId, quantity } });
  };

  let { loading, data: productData } = useQuery<
    GetProductByHandle,
    GetProductByHandleVariables
  >(GET_PRODUCT_BY_HANDLE, {
    fetchPolicy: 'network-only',
    onCompleted({ productByHandle }) {
      if (productByHandle) {
        let newOptions = [...options, ...productByHandle.options];
        setOptions(newOptions);
        setInfoTabs([
          ...[{ title: 'Description', content: productByHandle.description }],
        ]);
        let defaultOptions: OptionsData = {};
        for (let { name, values } of newOptions) {
          defaultOptions[name] = values[0];
        }
        setSelectedOptions(defaultOptions);
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

  return loading || !productData || !wishlistData ? (
    <View style={styles.centered}>
      <ActivityIndicator size="large" />
    </View>
  ) : dimensions.screenSize === ScreenSize.Large ? (
    <ProductDetailsLandscape
      selectedOptions={selectedOptions}
      onSelectionOptionChange={changeSelectedOptions}
      quantity={quantity}
      onChangeQuantity={setQuantity}
      onAddToCartPress={onAddToCart}
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
      selectedOptions={selectedOptions}
      onSelectionOptionChange={changeSelectedOptions}
      quantity={quantity}
      onChangeQuantity={setQuantity}
      onAddToCartPress={onAddToCart}
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
