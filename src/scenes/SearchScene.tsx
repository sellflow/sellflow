import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text } from 'exoflex';

import { SearchInput } from '../core-ui';
import { COLORS } from '../constants/colors';
import { FONT_SIZE } from '../constants/fonts';
import { useDebounce } from '../helpers/debounce';

const recentSearches = [
  'Marc & Spencer',
  'Long Sleeves T Shirt',
  'Banana Republic',
  'Tom Ford Backpack',
];

export default function SearchScene() {
  let [searchKeyword, setSearchKeyword] = useState('');
  let debouncedSearchTerm = useDebounce(searchKeyword);

  let renderResultList = () => {
    return (
      <FlatList
        data={
          debouncedSearchTerm
            ? recentSearches
            : recentSearches.slice().reverse()
        }
        renderItem={({ item }) => (
          <Text style={styles.searchKeyword}>{item}</Text>
        )}
        keyExtractor={(index) => index.toString()}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchInputContainer}>
        <SearchInput
          placeholder={t('Find by brand, category, etc.')}
          containerStyle={styles.searchInput}
          autoFocus={true}
          value={searchKeyword}
          onChangeText={setSearchKeyword}
        />
      </View>
      <View style={styles.searchResult}>
        <Text style={styles.textStyle}>
          {!debouncedSearchTerm ? t('Recent Searches') : t('Search Results')}
        </Text>
        {renderResultList()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInputContainer: {
    backgroundColor: COLORS.white,
    borderBottomColor: COLORS.lightGrey,
    borderBottomWidth: 1,
  },
  searchInput: {
    marginHorizontal: 24,
    marginVertical: 16,
  },
  textStyle: {
    opacity: 0.6,
    marginBottom: 16,
  },
  searchResult: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  searchKeyword: {
    fontSize: FONT_SIZE.medium,
    marginBottom: 16,
  },
});
