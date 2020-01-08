import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { View, StyleSheet } from 'react-native';

import { RichRadioGroup } from '../../../core-ui';

export default function richRadioGroupStory() {
  return storiesOf('Rich Radio Group', module).add('Default', () => (
    <View style={style.container}>
      <RichRadioGroup
        data={[
          { name: 'Size', values: ['S', 'M', 'L', 'XL'] },
          {
            name: 'Color',
            values: ['Brown', 'Blue', 'Black', 'Red', 'Green', 'Yellow'],
          },
        ]}
        onSelect={(item) => item}
      />
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
