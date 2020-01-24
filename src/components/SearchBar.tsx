import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Modal,
  SafeAreaView,
  BackHandler,
} from 'react-native';
import { Text, Button, IconButton } from 'exoflex';

import { COLORS } from '../constants/colors';
import { FONT_SIZE } from '../constants/fonts';
import { SearchInput } from '../core-ui';

const recentSearches = [
  'Marc & Spencer',
  'Long Sleeves T Shirt',
  'Banana Republic',
  'Tom Ford Backpack',
];

export default function SearchBar() {
  let [searchText, setSearchText] = useState('');
  let [isVisible, setVisible] = useState(false);

  useEffect(() => {
    let backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      setVisible(false);
      return true;
    });
    return () => {
      backHandler.remove();
    };
  }, []);

  let renderResultList = () => {
    return (
      <FlatList
        data={searchText ? recentSearches : recentSearches.slice().reverse()}
        renderItem={({ item }) => (
          <Text style={styles.searchResult}>{item}</Text>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  };

  return (
    <>
      <Modal visible={isVisible} animated={true} animationType="slide">
        <SafeAreaView style={styles.flex}>
          <View style={styles.searchInputContainer}>
            <SearchInput
              placeholder={t('Find by brand, category, etc.')}
              style={styles.searchInput}
              autoFocus={true}
              value={searchText}
              onChangeText={setSearchText}
            />
            <IconButton
              icon="close"
              style={styles.closeIcon}
              onPress={() => setVisible(false)}
            />
          </View>
          <View style={styles.searchResultList}>
            <Text style={styles.labelText}>
              {!searchText ? t('Recent Searches') : t('Search Results')}
            </Text>
            {renderResultList()}
          </View>
        </SafeAreaView>
      </Modal>

      <Button
        style={styles.buttonContainer}
        contentStyle={styles.buttonContent}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.searchText}>{t('Search')}</Text>
      </Button>
    </>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  searchInputContainer: {
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginLeft: 24,
    marginVertical: 16,
  },
  closeIcon: {
    // The default marginTop is 8, but the icon appears a little off-center
    // vertically, so we're bumping it by two points.
    marginTop: 10,
  },
  labelText: {
    opacity: 0.6,
    marginBottom: 16,
  },
  searchResultList: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  searchResult: {
    fontSize: FONT_SIZE.medium,
    marginBottom: 16,
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
});
