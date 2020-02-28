import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  Alert,
  FlatList,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  IconButton,
  Button,
  ActivityIndicator,
  TextInput,
} from 'exoflex';
import { useRoute } from '@react-navigation/native';
import ImageViewer from 'react-native-image-zoom-viewer';

import { COLORS } from '../constants/colors';
import { FONT_SIZE } from '../constants/fonts';
import { defaultButton, defaultButtonLabel } from '../constants/theme';
import { useDimensions, ScreenSize } from '../helpers/dimensions';
import formatCurrency from '../helpers/formatCurrency';
import { TabView, RichRadioGroup, DiscountBadge } from '../core-ui';
import { TabRoute } from '../core-ui/TabView';
import { Product, VariantQueryData } from '../types/types';
import { StackRouteProp } from '../types/Navigation';

import { valueBetweenZeroToMax } from '../helpers/valueBetweenZeroToMax';
import { useAddToCart } from '../hooks/api/useShoppingCart';
import {
  useGetProductByHandle,
  useGetProductVariant,
} from '../hooks/api/useProduct';
import {
  useAddItemToWishlist,
  useRemoveItemFromWishlist,
  useGetWishlistData,
} from '../hooks/api/useWishlist';
import Toast from '../core-ui/Toast';

type ProductDetailsProps = {
  onSelectionOptionChange: (key: string, value: string) => void;
  selectedOptions: OptionsData;
  quantity: number;
  onChangeQuantity: React.Dispatch<React.SetStateAction<number>>;
  product: Product;
  productImages: Array<string>;
  productDiscount: number;
  productOriginalPrice: number;
  isToastVisible: boolean;
  options?: Options;
  infoTabs?: Tabs;
  isLoading: boolean;
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
  productOriginalPrice: number;
  quantity: number;
  onChangeQuantity: React.Dispatch<React.SetStateAction<number>>;
  product: Product;
  options: Options;
  infoTabs: Tabs;
}) {
  let {
    product,
    productOriginalPrice,
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
        {productOriginalPrice && productOriginalPrice > 0 ? (
          <View style={styles.flexRow}>
            <Text weight="bold" style={styles.productInfoPrice}>
              {formatCurrency(product.price)}
            </Text>
            <Text weight="bold" style={styles.productInfoOriginalPrice}>
              {formatCurrency(productOriginalPrice)}
            </Text>
          </View>
        ) : (
          <Text weight="bold" style={styles.productInfoPrice}>
            {formatCurrency(product.price)}
          </Text>
        )}
      </View>

      {radioGroupRenderView}
      <View style={styles.paddingHorizontal}>
        <Text style={styles.quantityText}>Quantity</Text>
        <TextInput
          containerStyle={styles.textInputStyle}
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
      <TabView isScrollEnabled={true} routes={infoTabRoutes(infoTabs)} />
    </>
  );
}

function BottomActionBar(props: ProductDetailsProps) {
  let { addToWishlist } = useAddItemToWishlist();
  let { removeFromWishlist } = useRemoveItemFromWishlist();
  let {
    isWishlistActive,
    onWishlistPress,
    onAddToCartPress,
    product,
    isLoading,
  } = props;

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
        disabled={isLoading}
        loading={isLoading}
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
    productImages,
    productDiscount,
    productOriginalPrice,
    options,
    infoTabs,
    quantity,
    onChangeQuantity,
    onSelectionOptionChange,
    isToastVisible,
    selectedOptions,
  } = props;
  let dimensions = useDimensions();

  let [isImageModalVisible, setIsImageModalVisible] = useState<boolean>(false);
  let [activeIndex, setActiveIndex] = useState<number>(0);

  let onPressImage = (index: number) => {
    setIsImageModalVisible(!isImageModalVisible);
    setActiveIndex(index);
  };

  let renderHeader = () => (
    <IconButton
      icon="chevron-left"
      color={COLORS.white}
      size={35}
      onPress={() => setIsImageModalVisible(false)}
    />
  );

  let images = productImages.map((url) => ({ url }));

  return (
    <>
      <View style={[styles.flex, styles.flexRow]}>
        <Modal
          visible={isImageModalVisible}
          transparent={true}
          onDismiss={() => setIsImageModalVisible(false)}
        >
          <ImageViewer
            index={activeIndex}
            imageUrls={images}
            enableSwipeDown
            onSwipeDown={() => setIsImageModalVisible(false)}
            renderHeader={renderHeader}
          />
        </Modal>
        <FlatList
          style={styles.flex}
          horizontal
          pagingEnabled
          data={productImages}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                style={styles.flex}
                onPress={() => onPressImage(index)}
              >
                <Image
                  source={{ uri: item }}
                  style={{
                    width: dimensions.width / 2,
                    height: '100%',
                  }}
                  resizeMode="cover"
                />
                {productDiscount > 0 ? (
                  <DiscountBadge
                    value={productDiscount}
                    containerStyle={[
                      styles.discountBox,
                      styles.discountBoxTablet,
                    ]}
                    textStyle={styles.discountBoxTabletText}
                  />
                ) : null}
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item}
        />

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
              productOriginalPrice={productOriginalPrice}
              options={options ? options : []}
              infoTabs={infoTabs ? infoTabs : []}
            />
          </ScrollView>
          <View
            style={[styles.bottomContainer, styles.bottomLandscapeContainer]}
          >
            <BottomActionBar {...props} />
          </View>
        </View>
      </View>
      <Toast
        data={{
          message: t('Item Successfully Added'),
          isVisible: isToastVisible,
          mode: 'success',
        }}
      />
    </>
  );
}

function ProductDetailsPortrait(props: ProductDetailsProps) {
  let {
    product,
    productImages,
    productDiscount,
    productOriginalPrice,
    options,
    infoTabs,
    quantity,
    selectedOptions,
    onChangeQuantity,
    onSelectionOptionChange,
    isToastVisible,
  } = props;
  let dimensions = useDimensions();

  let [isImageModalVisible, setIsImageModalVisible] = useState<boolean>(false);
  let [activeIndex, setActiveIndex] = useState<number>(0);

  let onPressImage = (index: number) => {
    setIsImageModalVisible(!isImageModalVisible);
    setActiveIndex(index);
  };

  let renderHeader = () => (
    <IconButton
      icon="chevron-left"
      color={COLORS.white}
      size={35}
      onPress={() => setIsImageModalVisible(false)}
    />
  );

  let images = productImages.map((url) => ({ url }));

  let isTablet = dimensions.screenSize === ScreenSize.Medium;

  return (
    <>
      <ScrollView style={styles.flex}>
        <Modal
          visible={isImageModalVisible}
          onDismiss={() => setIsImageModalVisible(false)}
        >
          <ImageViewer
            index={activeIndex}
            imageUrls={images}
            enableSwipeDown
            onSwipeDown={() => setIsImageModalVisible(false)}
            renderHeader={renderHeader}
          />
        </Modal>
        <FlatList
          style={styles.flex}
          pagingEnabled
          horizontal
          data={productImages}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                style={styles.flex}
                onPress={() => onPressImage(index)}
              >
                <Image
                  source={{ uri: item }}
                  style={{
                    width: dimensions.width,
                    height:
                      dimensions.screenSize === ScreenSize.Small ? 320 : 576,
                  }}
                  resizeMode="contain"
                />
                {productDiscount > 0 ? (
                  <DiscountBadge
                    value={productDiscount}
                    containerStyle={
                      isTablet
                        ? [styles.discountBox, styles.discountBoxTablet]
                        : styles.discountBox
                    }
                    textStyle={isTablet && styles.discountBoxTabletText}
                  />
                ) : null}
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item}
        />

        <View style={styles.flex}>
          <ProductInfo
            selectedOptions={selectedOptions}
            onSelectionOptionChange={onSelectionOptionChange}
            quantity={quantity}
            onChangeQuantity={onChangeQuantity}
            product={product}
            productOriginalPrice={productOriginalPrice}
            options={options ? options : []}
            infoTabs={infoTabs ? infoTabs : []}
          />
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <BottomActionBar {...props} />
      </View>
      <Toast
        data={{
          message: t('Item Successfully Added'),
          isVisible: isToastVisible,
          mode: 'success',
        }}
      />
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

  let [isToastVisible, setIsToastVisible] = useState<boolean>(false);
  let [isWishlistActive, setWishlistActive] = useState<boolean>(false);
  let [options, setOptions] = useState<Options>([]);
  let [quantity, setQuantity] = useState<number>(1);
  let [selectedOptions, setSelectedOptions] = useState<OptionsData>({});
  let [infoTabs, setInfoTabs] = useState<Tabs>([
    { title: t('Description'), content: '' },
  ]);
  let [productImages, setProductImages] = useState<Array<string>>([]);
  let [productDiscount, setProductDiscount] = useState<number>(0);
  let [productOriginalPrice, setProductOriginalPrice] = useState<number>(0);
  let [variantID, setVariantID] = useState<string>('');

  let showToast = (duration: number) => {
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, duration);
  };

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

  let { addToCart, loading: addToCartLoading } = useAddToCart({
    onCompleted: () => {
      showToast(1100);
    },
  });

  let { getVariant, loading: getVariantIDLoading } = useGetProductVariant({
    onCompleted: ({ productByHandle }) => {
      if (productByHandle && productByHandle.variantBySelectedOptions) {
        let {
          id,
          compareAtPriceV2,
          priceV2,
        } = productByHandle.variantBySelectedOptions;
        if (compareAtPriceV2) {
          let originalPrice = compareAtPriceV2.amount;
          let discount =
            ((compareAtPriceV2.amount - priceV2.amount) /
              compareAtPriceV2.amount) *
            100;
          setProductDiscount(discount);
          setProductOriginalPrice(Math.round(originalPrice));
        }

        setVariantID(id);
      }
    },
  });

  useEffect(() => {
    let queryVariantID = extractOptionsData(selectedOptions);
    getVariant({
      variables: { selectedOptions: queryVariantID, handle: product.handle },
    });
  }, [selectedOptions, getVariant, product.handle]);

  let isLoading = getVariantIDLoading || addToCartLoading;

  let { data: wishlistData } = useGetWishlistData({
    onCompleted: ({ wishlist }) => {
      if (wishlist.find((item) => item.handle === product.handle)) {
        setWishlistActive(true);
      }
    },
  });

  let onAddToCart = () => {
    addToCart({ variables: { variantId: variantID, quantity } });
  };

  let {
    data: productData,
    loading: getProductByHandleLoading,
  } = useGetProductByHandle({
    variables: { productHandle: product.handle },
    fetchPolicy: 'network-only',
    onCompleted({ productByHandle }) {
      if (productByHandle) {
        let newOptions = [...options, ...productByHandle.options];
        setOptions(newOptions);
        setInfoTabs([
          ...[
            {
              title: t('Description'),
              content:
                productByHandle.description !== ''
                  ? productByHandle.description
                  : t('No Description Yet'),
            },
          ],
        ]);
        setProductImages(
          productByHandle.images.edges.map((item) => item.node.originalSrc),
        );
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
  });

  return getProductByHandleLoading || !productData || !wishlistData ? (
    <View style={styles.centered}>
      <ActivityIndicator size="large" />
    </View>
  ) : dimensions.screenSize === ScreenSize.Large ? (
    <ProductDetailsLandscape
      isToastVisible={isToastVisible}
      selectedOptions={selectedOptions}
      onSelectionOptionChange={changeSelectedOptions}
      quantity={quantity}
      onChangeQuantity={setQuantity}
      onAddToCartPress={onAddToCart}
      product={product}
      productImages={productImages}
      productDiscount={productDiscount}
      productOriginalPrice={productOriginalPrice}
      options={options}
      isLoading={isLoading}
      infoTabs={infoTabs}
      isWishlistActive={isWishlistActive}
      onWishlistPress={(isActive) => {
        setWishlistActive(isActive);
      }}
    />
  ) : (
    <ProductDetailsPortrait
      isToastVisible={isToastVisible}
      selectedOptions={selectedOptions}
      onSelectionOptionChange={changeSelectedOptions}
      quantity={quantity}
      onChangeQuantity={setQuantity}
      onAddToCartPress={onAddToCart}
      product={product}
      productImages={productImages}
      productDiscount={productDiscount}
      productOriginalPrice={productOriginalPrice}
      options={options}
      isLoading={isLoading}
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
  paddingHorizontal: {
    paddingHorizontal: 24,
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
  productInfoOriginalPrice: {
    paddingLeft: 8,
    color: COLORS.priceGrey,
    fontSize: FONT_SIZE.large,
    textDecorationLine: 'line-through',
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 14,
  },
  quantityText: {
    opacity: 0.6,
    fontSize: FONT_SIZE.small,
    marginBottom: 12,
  },
  textInputStyle: {
    width: 80,
    height: 48,
  },
  discountBox: {
    position: 'absolute',
    top: 24,
    right: 0,
  },
  discountBoxTablet: {
    top: 36,
    height: 42,
    paddingHorizontal: 12,
  },
  discountBoxTabletText: {
    fontSize: FONT_SIZE.large,
  },
});
