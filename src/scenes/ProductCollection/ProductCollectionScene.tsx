import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, Slider, TextInput } from 'exoflex';
import { useNavigation } from '@react-navigation/native';

import { wishlist } from '../../fixtures/wishlist';
import { ProductList } from '../../components';
import {
  useDimensions,
  ScreenSize,
  NUM_COLUMNS,
} from '../../helpers/dimensions';
import { COLORS } from '../../constants/colors';
import { FONT_FAMILY, FONT_SIZE } from '../../constants/fonts';
import { SortModal, SortRadioGroup } from './components';
import { NavigationProp } from '../../types/Navigation';

export default function ProductCollectionScene() {
  let { navigate } = useNavigation<NavigationProp<'ProductCollection'>>();
  let [isModalVisible, setModalVisible] = useState(false);
  let [radioButtonValue, setRadioButtonValue] = useState('');
  let [minPrice, setMinPrice] = useState(0);
  let [maxPrice, setMaxPrice] = useState(10000);

  let { screenSize } = useDimensions();
  let numColumns: number;
  switch (screenSize) {
    case ScreenSize.Medium: {
      numColumns = NUM_COLUMNS.MEDIUM;
      break;
    }
    case ScreenSize.Large: {
      numColumns = 3;
      break;
    }
    default: {
      numColumns = NUM_COLUMNS.SMALL;
    }
  }
  let containerStyle = [
    styles.container,
    screenSize === ScreenSize.Large && styles.containerLandscape,
  ];

  let renderFilterAndSort = () => {
    if (screenSize === ScreenSize.Large) {
      return (
        <ScrollView style={styles.sideMenu}>
          <View style={[styles.menuContainer, styles.menuBorder]}>
            <Text style={styles.menuTitle}>{t('Sort By')}</Text>
            <SortRadioGroup
              radioButtonValue={radioButtonValue}
              onValueChange={(newValue: string) =>
                setRadioButtonValue(newValue)
              }
            />
          </View>
          <View style={styles.menuContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.menuTitle}>{t('Price')}</Text>
              <TouchableOpacity
                onPress={() => {
                  setMinPrice(0);
                  setMaxPrice(10000);
                }}
              >
                <Text style={styles.clearButton}>{t('Clear')}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.sliderContainer}>
              <Slider
                sliderLength={240}
                values={[minPrice, maxPrice]}
                showLabel={false}
                min={minPrice}
                max={maxPrice}
                step={10}
                onValuesChange={(values: Array<number>) => {
                  setMinPrice(values[0]);
                  setMaxPrice(values[1]);
                }}
              />
            </View>
            <View style={styles.textInputContainer}>
              <TextInput
                mode="outlined"
                label={t('Min. Price')}
                keyboardType="number-pad"
                containerStyle={[styles.textInput, styles.margin]}
                value={minPrice.toString()} // TODO: Change to formatted number
                onChangeText={(text: string) => setMinPrice(Number(text))}
              />
              <TextInput
                mode="outlined"
                label={t('Max. Price')}
                containerStyle={styles.textInput}
                keyboardType="number-pad"
                value={maxPrice.toString()} // TODO: Change to formatted number
                onChangeText={(text: string) => setMaxPrice(Number(text))}
              />
            </View>
            <Button>{t('Set Filter')}</Button>
          </View>
        </ScrollView>
      );
    }
    return (
      <View style={styles.buttonContainer}>
        <Button
          icon="filter-variant"
          preset="invisible"
          style={[styles.button, styles.filter]}
          contentStyle={styles.buttonContent}
          uppercase={false}
          labelStyle={styles.buttonLabel}
          onPress={() => {
            // TODO: Modal Filter
          }}
        >
          {t('Filter')}
        </Button>
        <Button
          icon="swap-vertical"
          preset="invisible"
          style={styles.button}
          uppercase={false}
          labelStyle={styles.buttonLabel}
          onPress={() => setModalVisible(true)}
        >
          {t('Sort By')}
        </Button>
      </View>
    );
  };

  return (
    <View style={containerStyle}>
      {renderFilterAndSort()}
      <View style={styles.productsContainer}>
        <Text style={styles.count}>
          {t('Showing {count} item(s)', { count: wishlist.length })}
        </Text>
        <ProductList
          data={wishlist}
          numColumns={numColumns}
          contentContainerStyle={styles.productList}
          onItemPress={() => navigate('ProductDetails')}
        />
      </View>
      <SortModal
        isModalVisible={isModalVisible}
        toggleModal={() => setModalVisible(!isModalVisible)}
        radioButtonValue={radioButtonValue}
        onValueChange={(newValue: string) => setRadioButtonValue(newValue)}
      />
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
  sideMenu: {
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
  sliderContainer: {
    alignItems: 'center',
    flex: 1,
    marginVertical: 8,
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  textInput: {
    flex: 1,
    height: 60,
  },
  margin: {
    marginRight: 16,
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
