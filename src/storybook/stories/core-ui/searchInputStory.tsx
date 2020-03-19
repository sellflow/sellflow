import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { View, StyleSheet } from 'react-native';

import { SearchInput } from '../../../core-ui';

export default function searchInputStory() {
  return storiesOf('Search Input', module).add('Search Input', () => (
    <View style={style.container}>
      <SearchInput
        style={style.searchInput}
        placeholder="Find by brand, category, etc."
      />
    </View>
  ));
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  searchInput: {
    marginHorizontal: 20,
  },
});
