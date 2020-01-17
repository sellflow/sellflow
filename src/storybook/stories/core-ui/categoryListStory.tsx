import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { View, StyleSheet } from 'react-native';

import { CategoryList } from '../../../core-ui';
import { CategoryListData } from '../../../fixtures/CategoryListData';

export default function categoryListStory() {
  return storiesOf('Category List', module).add('Category List', () => (
    <View style={style.container}>
      <CategoryList
        categories={CategoryListData}
        onSelect={(category) => category}
      />
    </View>
  ));
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
