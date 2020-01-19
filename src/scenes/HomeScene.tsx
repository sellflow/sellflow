import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  StyleProp,
  ViewStyle,
  ScrollView,
} from 'react-native';
import { Text } from 'exoflex';

import { useDimensions, ScreenSize } from '../helpers/dimensions';
import { Carousel, CategoryList } from '../core-ui';
import { ProductItem } from '../components';

import { CarouselData } from '../fixtures/carousel';
import { ProductItemData } from '../fixtures/ProductItemData';
import { CategoryListData } from '../fixtures/CategoryListData';

function Header() {
  let dimensions = useDimensions();

  return (
    <>
      <Carousel
        data={CarouselData}
        height={dimensions.screenSize === ScreenSize.Small ? 180 : 384}
      />

      <View style={styles.subTitleContainer}>
        <Text style={styles.subTitle}>{t('Browse By Category')}</Text>
        <CategoryList
          categories={CategoryListData}
          onSelect={(category) => category}
        />
      </View>

      <View style={styles.subTitleContainer}>
        <Text style={styles.subTitle}>{t('Featured Products')}</Text>
      </View>
    </>
  );
}

export default function HomeScene() {
  let dimensions = useDimensions();

  let productItemStyle = {
    flex: 1,
    height: 270,
    maxHeight: 270,
    marginBottom: 24,
  } as StyleProp<ViewStyle>;

  let isHorizontal = dimensions.screenSize !== ScreenSize.Small;

  return (
    <ScrollView>
      <Header />
      {isHorizontal ? (
        <FlatList
          style={styles.flex}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={ProductItemData}
          renderItem={({ item }) => {
            return (
              <View style={styles.flex}>
                <ProductItem
                  product={item}
                  onPress={() => {}}
                  containerStyle={productItemStyle}
                />
              </View>
            );
          }}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <FlatList
          style={styles.flex}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          data={ProductItemData}
          renderItem={({ item }) => {
            return (
              <View style={styles.flex}>
                <ProductItem
                  product={item}
                  onPress={() => {}}
                  containerStyle={productItemStyle}
                />
              </View>
            );
          }}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  subTitle: {
    marginTop: 16,
    marginBottom: 12,
  },
  subTitleContainer: {
    marginHorizontal: 24,
  },
});
