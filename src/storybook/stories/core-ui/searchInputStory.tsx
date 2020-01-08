import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { View, StyleSheet } from 'react-native';

import { SearchInput } from '../../../core-ui';

export default function searchInputStory() {
  return storiesOf('Search Input', module).add('Default', () => (
    <View style={style.container}>
      <SearchInput placeholder="Find by brand, category, etc." />
    </View>
  ));
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
