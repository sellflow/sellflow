import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { ActivityIndicator, IconButton, useTheme } from 'react-native-paper';

import { COLORS } from '../constants/colors';
import { FONT_SIZE } from '../constants/fonts';
import { SearchInput, Text } from '../core-ui';
import useDefaultCountry from '../hooks/api/useDefaultCountry';
import {
  useGetRecentSearch,
  useSearchProductsQuery,
  useSetRecentSearch,
} from '../hooks/api/useSearchProduct';
import { Product } from '../types/types';

type Props = {
  onItemPress: (product: Product) => void;
  onSubmit: (searchKeyword: string) => void;
  isVisible: boolean;
  setVisible: (visible: boolean) => void;
};

export default function SearchModal(props: Props) {
  let [searchText, setSearchText] = useState('');
  let [debouncedSearchText, setDebouncedSearchtext] = useState('');
  let { isVisible, setVisible, onItemPress, onSubmit } = props;
  let { isRTL } = useTheme();

  let {
    searchProducts,
    results,
    loading: searchLoading,
  } = useSearchProductsQuery();
  let { data: recentSearch } = useGetRecentSearch();
  let { setRecentSearch } = useSetRecentSearch();
  let {
    data: { countryCode },
  } = useDefaultCountry();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchText !== '') {
        setDebouncedSearchtext(searchText);
      }
    }, 250);
    return () => clearTimeout(timeout);
  }, [searchText]);

  useEffect(() => {
    searchProducts({
      variables: {
        first: 10,
        searchText: debouncedSearchText,
        country: countryCode,
      },
    });
  }, [countryCode, debouncedSearchText, searchProducts]);

  let renderList = (props: {
    recent?: Array<Product>;
    results?: Array<Product>;
  }) => {
    let { recent, results } = props;

    let onClickRecent = (item: Product) => setSearchText(item.title);
    let onClickResult = (item: Product) => {
      onItemPress(item);
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
      <Modal
        visible={isVisible}
        animated={true}
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <SafeAreaView style={styles.flex}>
          <View style={styles.searchInputContainer}>
            <IconButton
              icon={isRTL ? 'chevron-right' : 'chevron-left'}
              style={styles.closeIcon}
              color={COLORS.primaryColor}
              onPress={() => {
                setVisible(false);
                setSearchText('');
              }}
            />
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
                  onSubmit(searchText);
                  setSearchText('');
                }
              }}
            />
          </View>
          <View style={styles.searchResultList}>
            <Text style={styles.labelText}>
              {!searchText ? t('Recent Searches') : t('Search Results')}
            </Text>
            {searchLoading ? (
              <ActivityIndicator />
            ) : searchText !== '' ? (
              renderList({ results })
            ) : (
              renderList({ recent: recentSearch.recentSearch })
            )}
          </View>
        </SafeAreaView>
      </Modal>
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
    marginRight: 24,
    marginVertical: 16,
  },
  closeIcon: {
    marginTop: 10,
    marginLeft: 16,
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
});
