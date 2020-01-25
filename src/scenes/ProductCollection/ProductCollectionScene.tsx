import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, ActivityIndicator } from 'exoflex';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@apollo/react-hooks';

import { ProductList } from '../../components';
import { useDimensions, ScreenSize } from '../../helpers/dimensions';
import { COLORS } from '../../constants/colors';
import { FONT_FAMILY, FONT_SIZE } from '../../constants/fonts';
import {
  SortModal,
  SortRadioGroup,
  PriceSlider,
  FilterModal,
} from './components';
import { useColumns } from '../../helpers/columns';
import { StackNavProp } from '../../types/Navigation';
import { GET_COLLECTION } from '../../graphql/server/productCollection';
import { GetCollection } from '../../generated/server/GetCollection';
import { Product } from '../../types/types';

const DEFAULT_MAX_PRICE = 1000;

function getProducts(
  collectionData: GetCollection | undefined,
): Array<Product> {
  if (collectionData) {
    if (collectionData.collectionByHandle) {
      return collectionData.collectionByHandle.products.edges.map((item) => {
        let product = item.node;
        return {
          id: product.id,
          image: product.images.edges[0].node.transformedSrc.toString(),
          title: product.title,
          productType: product.productType,
          price: Number(
            product.presentmentPriceRanges.edges[0].node.minVariantPrice.amount,
          ),
        };
      });
    }
  }
  return [
    {
      id: '',
      title: '',
      productType: '',
      price: 0,
      image: '',
    },
  ];
}

export default function ProductCollectionScene() {
  let { navigate, setOptions } = useNavigation<
    StackNavProp<'ProductCollection'>
  >();

  let [isSortModalVisible, setSortModalVisible] = useState(false);
  let [isFilterModalVisible, setFilterModalVisible] = useState(false);
  let [radioButtonValue, setRadioButtonValue] = useState('');
  let [priceRange, setPriceRange] = useState([0, DEFAULT_MAX_PRICE]);
  let { screenSize } = useDimensions();
  let numColumns = useColumns();
  let isScreenSizeLarge = screenSize === ScreenSize.Large;

  let { data: collectionData, loading } = useQuery<GetCollection>(
    GET_COLLECTION,
    {
      variables: {
        // TODO: Use collection handle from params
        collectionHandle: 'accessories',
      },
    },
  );

  let collection = getProducts(collectionData);

  let containerStyle = [
    styles.container,
    isScreenSizeLarge && styles.containerLandscape,
  ];

  let onClear = () => setPriceRange([0, DEFAULT_MAX_PRICE]);
  let toggleSortModal = () => setSortModalVisible(!isSortModalVisible);
  let toggleFilterModal = () => setFilterModalVisible(!isFilterModalVisible);
  let onPressRadioButton = (newValue: string) => setRadioButtonValue(newValue);
  let onSetFilter = (values: Array<number>) => setPriceRange(values);

  let SideBarMenu = () => {
    return (
      <ScrollView style={styles.sideBarMenu}>
        <View style={[styles.menuContainer, styles.menuBorder]}>
          <Text style={styles.menuTitle}>{t('Sort By')}</Text>
          <SortRadioGroup
            radioButtonValue={radioButtonValue}
            onValueChange={onPressRadioButton}
          />
        </View>
        <View style={styles.menuContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.menuTitle}>{t('Price')}</Text>
            <TouchableOpacity onPress={onClear}>
              <Text style={styles.clearButton}>{t('Clear')}</Text>
            </TouchableOpacity>
          </View>
          <PriceSlider
            minPrice={0}
            maxPrice={DEFAULT_MAX_PRICE}
            initialSliderValues={priceRange}
            onSubmit={onSetFilter}
            submitButtonText={t('Set Filter')}
            onValuesChangeStart={() => {
              setOptions({
                gestureEnabled: false,
              });
            }}
            onValuesChangeFinish={() => {
              setOptions({
                gestureEnabled: true,
              });
            }}
          />
        </View>
      </ScrollView>
    );
  };

  let TopBarMenu = () => {
    return (
      <View style={styles.buttonContainer}>
        <Button
          icon="filter-variant"
          preset="invisible"
          style={[styles.button, styles.filter]}
          contentStyle={styles.buttonContent}
          uppercase={false}
          labelStyle={styles.buttonLabel}
          onPress={toggleFilterModal}
        >
          {t('Filter')}
        </Button>
        <Button
          icon="swap-vertical"
          preset="invisible"
          style={styles.button}
          uppercase={false}
          labelStyle={styles.buttonLabel}
          onPress={toggleSortModal}
        >
          {t('Sort By')}
        </Button>
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View style={containerStyle}>
      {isScreenSizeLarge ? <SideBarMenu /> : <TopBarMenu />}
      <View style={styles.productsContainer}>
        <Text style={styles.count}>
          {t('Showing {count} item(s)', { count: collection.length })}
        </Text>
        <ProductList
          data={collection}
          numColumns={isScreenSizeLarge ? numColumns - 2 : numColumns}
          contentContainerStyle={styles.productList}
          onItemPress={(product) => navigate('ProductDetails', { product })}
        />
      </View>
      {!isScreenSizeLarge && (
        <>
          <SortModal
            isModalVisible={isSortModalVisible}
            toggleModal={toggleSortModal}
            radioButtonValue={radioButtonValue}
            onValueChange={onPressRadioButton}
          />
          <FilterModal
            minPrice={0}
            maxPrice={DEFAULT_MAX_PRICE}
            initialSliderValues={priceRange}
            isModalVisible={isFilterModalVisible}
            toggleModal={toggleFilterModal}
            onSubmit={onSetFilter}
            onClear={onClear}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLandscape: {
    flexDirection: 'row',
  },
  productsContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    borderBottomColor: COLORS.lightGrey,
    borderBottomWidth: 1,
  },
  button: {
    flex: 1,
  },
  buttonContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLabel: {
    color: COLORS.black,
    fontFamily: FONT_FAMILY.MEDIUM,
    fontSize: FONT_SIZE.medium,
  },
  filter: {
    borderRightWidth: 1,
    borderRightColor: COLORS.lightGrey,
  },
  count: {
    marginLeft: 12,
    marginBottom: 16,
  },
  productList: {
    marginBottom: 16,
  },
  sideBarMenu: {
    width: 320,
    maxWidth: 320,
    borderRightColor: COLORS.lightGrey,
    borderRightWidth: 1,
    paddingHorizontal: 36,
    paddingVertical: 16,
  },
  menuContainer: {
    marginBottom: 16,
  },
  menuBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
  },
  menuTitle: {
    fontFamily: FONT_FAMILY.MEDIUM,
    fontSize: FONT_SIZE.large,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  clearButton: {
    fontFamily: FONT_FAMILY.MEDIUM,
    color: COLORS.primaryColor,
    fontSize: FONT_SIZE.medium,
  },
});
