import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'exoflex';
import { useNavigation } from '@react-navigation/native';

import { useDimensions, ScreenSize } from '../helpers/dimensions';
import { Carousel, CategoryList } from '../core-ui';
import { ProductList } from '../components';
import { COLORS } from '../constants/colors';
import { FONT_SIZE } from '../constants/fonts';
import { CarouselData } from '../fixtures/carousel';
import { ProductItemData } from '../fixtures/ProductItemData';
import { CategoryListData } from '../fixtures/CategoryListData';
import { NavigationProp } from '../types/Navigation';

// TODO: I kinda think this should be a real TextInput, however we don't really
// have "Shared Elements" in RN, so we need a way to fake it so that when this
// element receives focus, a bottom sheet appears with the search results.
function SearchBar(props: { onSearchPress: () => void }) {
  return (
    <View style={styles.searchBar}>
      <Button
        style={styles.buttonContainer}
        contentStyle={styles.buttonContent}
        onPress={props.onSearchPress}
      >
        <Text style={styles.searchText}>{t('Search')}</Text>
      </Button>
    </View>
  );
}

export default function HomeScene() {
  let { screenSize, isLandscape } = useDimensions();
  let { navigate } = useNavigation<NavigationProp<'Home'>>();

  let numColumns = screenSize === ScreenSize.Small ? 2 : isLandscape ? 5 : 4;

  let header = (
    <>
      <Carousel
        data={CarouselData}
        height={screenSize === ScreenSize.Small ? 180 : 384}
      />

      <View style={styles.subTitleContainer}>
        <Text style={styles.subTitle}>{t('Browse By Category')}</Text>
        <CategoryList
          categories={CategoryListData}
          onSelect={(collection) => {
            navigate('ProductCollection', { collection });
          }}
        />
      </View>

      <View style={styles.subTitleContainer}>
        <Text style={styles.subTitle}>{t('Featured Products')}</Text>
      </View>
    </>
  );

  return (
    <View style={styles.flex}>
      <SearchBar onSearchPress={() => navigate('Search')} />
      <ProductList
        ListHeaderComponent={() => header}
        data={ProductItemData}
        numColumns={numColumns}
        onItemPress={(product) => navigate('ProductDetails', { product })}
      />
    </View>
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
  buttonContainer: {
    marginVertical: 16,
    marginHorizontal: 24,
    backgroundColor: COLORS.darkWhite,
  },
  buttonContent: {
    justifyContent: 'flex-start',
    paddingHorizontal: 12,
  },
  searchText: {
    opacity: 0.6,
    color: COLORS.black,
    fontSize: FONT_SIZE.medium,
  },
  searchBar: {
    backgroundColor: COLORS.white,
  },
});
