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
import { ProductDetailsProps } from '../../../types/types';
import { Toast, DiscountBadge } from '../../../core-ui';
import { FONT_SIZE } from '../../../constants/fonts';
import ProductInfo from './ProductInfo';
import BottomActionBar from './BottomActionBar';

export default function ProductDetailsPortrait(props: ProductDetailsProps) {
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

const styles = StyleSheet.create({
  flex: {
    flex: 1,
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
