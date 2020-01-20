import React from 'react';
import { View, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Text, Button } from 'exoflex';
import { useNavigation } from '@react-navigation/native';

import { useDimensions, ScreenSize } from '../helpers/dimensions';
import { Carousel, CategoryList } from '../core-ui';
import { ProductItem } from '../components';
import { COLORS } from '../constants/colors';
import { FONT_SIZE } from '../constants/fonts';
import { CarouselData } from '../fixtures/carousel';
import { ProductItemData } from '../fixtures/ProductItemData';
import { CategoryListData } from '../fixtures/CategoryListData';
import { NavigationProp } from '../types/Navigation';
import { CategoryItem } from '../types/types';

type HeaderProps = {
  screenSize: ScreenSize;
  onCollectionPress: (item: CategoryItem) => void;
};

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

function Header(props: HeaderProps) {
  let { screenSize, onCollectionPress } = props;
  return (
    <>
      <Carousel
        data={CarouselData}
        height={screenSize === ScreenSize.Small ? 180 : 384}
      />

      <View style={styles.subTitleContainer}>
        <Text style={styles.subTitle}>{t('Browse By Category')}</Text>
        <CategoryList
          categories={CategoryListData}
          onSelect={onCollectionPress}
        />
      </View>

      <View style={styles.subTitleContainer}>
        <Text style={styles.subTitle}>{t('Featured Products')}</Text>
      </View>
    </>
  );
}

export default function HomeScene() {
  let { screenSize } = useDimensions();
  let { navigate } = useNavigation<NavigationProp<'Home'>>();

  let isHorizontal = screenSize !== ScreenSize.Small;

  return (
    <View>
      <SearchBar onSearchPress={() => navigate('Search')} />
      <ScrollView>
        <Header
          screenSize={screenSize}
          onCollectionPress={(collection) => {
            navigate('ProductCollection', { collection });
          }}
        />
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
                    containerStyle={styles.productItemStyle}
                  />
                </View>
              );
            }}
            keyExtractor={(item) => item.id}
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
                    containerStyle={styles.productItemStyle}
                  />
                </View>
              );
            }}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
      </ScrollView>
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
  productItemStyle: {
    flex: 1,
    height: 270,
    maxHeight: 270,
    marginBottom: 24,
  },
  searchBar: {
    backgroundColor: COLORS.white,
  },
});
