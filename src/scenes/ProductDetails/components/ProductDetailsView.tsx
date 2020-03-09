import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  FlatList,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { IconButton } from 'exoflex';
import ImageViewer from 'react-native-image-zoom-viewer';

import { COLORS } from '../../../constants/colors';
import { useDimensions, ScreenSize } from '../../../helpers/dimensions';
import { DiscountBadge } from '../../../core-ui';
import { FONT_SIZE } from '../../../constants/fonts';
import ProductInfo from './ProductInfo';
import BottomActionBar from './BottomActionBar';
import { OptionsData, Product, Options } from '../../../types/types';

type Props = {
  onSelectionOptionChange: (key: string, value: string) => void;
  selectedOptions: OptionsData;
  quantity: number;
  onChangeQuantity: (quantity: number) => void;
  product: Product;
  productImages: Array<string>;
  productDiscount: number;
  productOriginalPrice: number;
  options?: Options;
  isLoading: boolean;
  isWishlistActive: boolean;
  onAddToCartPress: () => void;
  onWishlistPress: (value: boolean) => void;
};

export default function ProductDetailsView(props: Props) {
  let {
    product,
    productImages,
    productDiscount,
    productOriginalPrice,
    options,
    quantity,
    onChangeQuantity,
    onSelectionOptionChange,
    selectedOptions,
  } = props;
  let { screenSize, width } = useDimensions();

  let [isImageModalVisible, setIsImageModalVisible] = useState<boolean>(false);
  let [activeIndex, setActiveIndex] = useState<number>(0);
  let isPhone = screenSize === ScreenSize.Small;
  let isTabletPortrait = screenSize === ScreenSize.Medium;
  let isLandscape = screenSize === ScreenSize.Large;

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
      style={styles.headerIcon}
    />
  );

  let images = productImages.map((url) => ({ url }));
  let imageSize = isLandscape
    ? {
        width: width / 2,
        height: '100%',
      }
    : {
        width,
        height: screenSize === ScreenSize.Small ? 320 : 576,
      };

  let renderProductImage = ({
    item,
    index,
  }: {
    item: string;
    index: number;
  }) => {
    return (
      <TouchableOpacity style={styles.flex} onPress={() => onPressImage(index)}>
        <Image
          source={{ uri: item }}
          style={imageSize}
          resizeMode={isLandscape ? 'cover' : 'contain'}
        />
        {productDiscount > 0 ? (
          <DiscountBadge
            value={productDiscount}
            containerStyle={
              isPhone
                ? [styles.discountBox, styles.discountBoxTablet]
                : styles.discountBox
            }
            textStyle={isTabletPortrait && styles.discountBoxTabletText}
          />
        ) : null}
      </TouchableOpacity>
    );
  };

  let ProductDetailsLandscape = () => (
    <View style={[styles.flex, styles.flexRow]}>
      <FlatList
        style={styles.flex}
        horizontal
        pagingEnabled
        data={productImages}
        renderItem={renderProductImage}
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
          />
        </ScrollView>
        <View style={[styles.bottomContainer, styles.bottomLandscapeContainer]}>
          <BottomActionBar {...props} />
        </View>
      </View>
    </View>
  );

  let ProductDetailsPortrait = () => (
    <>
      <ScrollView style={styles.flex}>
        <FlatList
          style={styles.flex}
          horizontal
          pagingEnabled
          data={productImages}
          renderItem={renderProductImage}
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
          />
        </View>
      </ScrollView>
      <View style={styles.bottomContainer}>
        <BottomActionBar {...props} />
      </View>
    </>
  );

  return (
    <>
      {isLandscape ? <ProductDetailsLandscape /> : <ProductDetailsPortrait />}
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
    </>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexColumn: {
    flexDirection: 'column',
  },
  headerIcon: {
    position: 'absolute',
    left: 0,
    top: 17,
    zIndex: 14,
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
