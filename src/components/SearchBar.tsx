import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Modal,
  SafeAreaView,
  BackHandler,
  TouchableOpacity,
} from 'react-native';
import { Text, Button, IconButton, ActivityIndicator } from 'exoflex';
import { useNavigation } from '@react-navigation/native';

import { COLORS } from '../constants/colors';
import { FONT_SIZE } from '../constants/fonts';
import { SearchInput } from '../core-ui';
import { StackNavProp } from '../types/Navigation';
import { Product } from '../types/types';
import {
  useSearchProductsQuery,
  useGetRecentSearch,
  useSetRecentSearch,
} from '../hooks/api/useSearchProduct';

export default function SearchBar() {
  let [searchText, setSearchText] = useState('');
  let [debouncedSearchText, setDebouncedSearchtext] = useState('');
  let [isVisible, setVisible] = useState(false);
  let { navigate } = useNavigation<StackNavProp<'Search'>>();

  let {
    searchProducts,
    data: searchResults,
    loading: searchLoading,
  } = useSearchProductsQuery();
  let { data: recentSearch } = useGetRecentSearch();
  let { setRecentSearch } = useSetRecentSearch();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchText !== '') {
        setDebouncedSearchtext(searchText);
      }
    }, 250);
    return () => clearTimeout(timeout);
  }, [searchText]);

  useEffect(() => {
    searchProducts({ variables: { searchText: debouncedSearchText } });
  }, [debouncedSearchText, searchProducts]);

  useEffect(() => {
    let backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      setVisible(false);
      return true;
    });
    return backHandler.remove();
  });

  let renderList = (props: {
    recent?: Array<Product>;
    results?: Array<Product>;
  }) => {
    let { recent, results } = props;

    let onClickRecent = (item: Product) => setSearchText(item.title);
    let onClickResult = (item: Product) => {
      navigate('ProductDetails', { product: item as Product });
      setVisible(false);
    };

    return (
      <FlatList
        data={(recent && recent) || (results && results) || null}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                if (recent) {
                  onClickRecent(item);
                }
                if (results) {
                  onClickResult(item);
                }
              }}
            >
              <Text style={styles.searchResults}>{item.title}</Text>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(_, index) => index.toString()}
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
              autoCapitalize="none"
              value={searchText}
              onChangeText={(value) => setSearchText(value)}
              onSubmitEditing={() => {
                if (searchText !== '') {
                  setRecentSearch({
                    variables: {
                      search: searchText,
                    },
                  });
                  setVisible(false);
                  navigate('ProductCollection', {
                    searchKeyword: searchText,
                  });
                }
              }}
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
            {searchLoading ? (
              <ActivityIndicator />
            ) : searchText !== '' ? (
              renderList({ results: searchResults })
            ) : (
              renderList({ recent: recentSearch.recentSearch })
            )}
          </View>
        </SafeAreaView>
      </Modal>

      <Button
        style={styles.buttonContainer}
        contentStyle={styles.buttonContent}
        onPress={() => {
          setVisible(true);
          setSearchText('');
        }}
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
  searchResults: {
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
