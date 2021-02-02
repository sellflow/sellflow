import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, ActivityIndicator } from 'exoflex';

import { ProductList } from '../../../components';
import { Product } from '../../../types/types';
import { useDimensions, ScreenSize } from '../../../helpers/dimensions';
import { useColumns } from '../../../helpers/columns';
import { COLORS } from '../../../constants/colors';
import { FONT_FAMILY, FONT_SIZE } from '../../../constants/fonts';
import { useGetHighestPrice } from '../../../hooks/api/useHighestPriceProduct';
import { formatSliderValue } from '../../../helpers/formatSliderValue';

import PriceSlider from './PriceSlider';
import SortRadioGroup from './SortRadioGroup';
import FilterModal from './FilterModal';
import SortModal from './SortModal';

type SortProps = {
  radioButtonValue: string;
  onPressRadioButton: (newValue: string) => void;
};

type FilterProps = {
  priceRange: [number, number];
  onClearFilter: () => void;
  onSetFilter: (values: [number, number]) => void;
  onValuesChangeStart: () => void;
  onValuesChangeFinish: () => void;
};

type Props = {
  products: Array<Product>;
  hasMore: boolean;
  onItemPress: (product: Product) => void;
  onEndReached: (info: { distanceFromEnd: number }) => void;
  sortProps: SortProps;
  filterProps: FilterProps;
};

export default function ProductsView(props: Props) {
  let maxPrice = useGetHighestPrice();
  let { sliderStep, maxPriceValue } = formatSliderValue(maxPrice);

  let {
    onItemPress,
    products,
    sortProps,
    filterProps,
    onEndReached,
    hasMore,
  } = props;
  let { radioButtonValue, onPressRadioButton } = sortProps;
  let {
    priceRange,
    onClearFilter,
    onSetFilter,
    onValuesChangeStart,
    onValuesChangeFinish,
  } = filterProps;

  let [isSortModalVisible, setSortModalVisible] = useState<boolean>(false);
  let [isFilterModalVisible, setFilterModalVisible] = useState<boolean>(false);
  let { screenSize } = useDimensions();
  let numColumns = useColumns();

  let toggleSortModal = () => setSortModalVisible(!isSortModalVisible);
  let toggleFilterModal = () => setFilterModalVisible(!isFilterModalVisible);

  let isScreenSizeLarge = screenSize === ScreenSize.Large;
  let containerStyle = [
    styles.flex,
    isScreenSizeLarge && styles.containerLandscape,
  ];

  let SideBarMenu = () => {
    return (
      <ScrollView style={styles.sideBarMenu}>
        <View style={[styles.menuContainer, styles.menuBorder]}>
          <Text style={styles.menuTitle}>{t('Sort By')}</Text>
          <SortRadioGroup
            radioButtonValue={radioButtonValue}
            onValueChange={(value) => {
              onPressRadioButton(value);
              toggleSortModal();
            }}
          />
        </View>
        <View style={styles.menuContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.menuTitle}>{t('Price')}</Text>
            <TouchableOpacity onPress={onClearFilter}>
              <Text style={styles.clearButton}>{t('Clear')}</Text>
            </TouchableOpacity>
          </View>
          <PriceSlider
            minPrice={0}
            maxPrice={maxPriceValue}
            initialSliderValues={priceRange}
            onSubmit={(values) => {
              onSetFilter(values);
              toggleFilterModal();
            }}
            submitButtonText={t('Set Filter')}
            onValuesChangeStart={onValuesChangeStart}
            onValuesChangeFinish={onValuesChangeFinish}
            sliderStep={sliderStep}
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
          style={[styles.flex, styles.filter]}
          contentStyle={styles.center}
          uppercase={false}
          labelStyle={styles.buttonLabel}
          onPress={toggleFilterModal}
        >
          {t('Filter')}
        </Button>
        <Button
          icon="swap-vertical"
          preset="invisible"
          style={styles.flex}
          uppercase={false}
          labelStyle={styles.buttonLabel}
          onPress={toggleSortModal}
        >
          {t('Sort By')}
        </Button>
      </View>
    );
  };

  return (
    <View style={containerStyle}>
      {isScreenSizeLarge ? <SideBarMenu /> : <TopBarMenu />}
      <View style={styles.productsContainer}>
        <Text style={styles.count}>
          {t('Showing {count} item(s)', {
            count: products.length,
          })}
        </Text>
        <ProductList
          data={products}
          numColumns={numColumns}
          contentContainerStyle={styles.productList}
          onItemPress={onItemPress}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.25}
          ListFooterComponent={() => {
            return hasMore ? (
              <ActivityIndicator style={styles.activityIndicator} />
            ) : null;
          }}
        />
      </View>
      {!isScreenSizeLarge && (
        <>
          <SortModal
            isModalVisible={isSortModalVisible}
            toggleModal={toggleSortModal}
            radioButtonValue={radioButtonValue}
            onValueChange={(value) => {
              onPressRadioButton(value);
              toggleSortModal();
            }}
          />
          <FilterModal
            minPrice={0}
            maxPrice={maxPriceValue}
            initialSliderValues={priceRange}
            isModalVisible={isFilterModalVisible}
            toggleModal={toggleFilterModal}
            onSubmit={(values) => {
              onSetFilter(values);
              toggleFilterModal();
            }}
            onClear={onClearFilter}
            sliderStep={sliderStep}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
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
  activityIndicator: {
    marginVertical: 24,
  },
});
