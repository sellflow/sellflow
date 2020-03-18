import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { View, StyleSheet } from 'react-native';

import { Toast } from '../../../core-ui';

export default function toastStory() {
  return storiesOf('Toast', module).add('Toast', () => (
    <View style={style.container}>
      <Toast
        data={{ message: 'This is a toast', isVisible: true, mode: 'info' }}
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
