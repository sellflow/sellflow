import React from 'react';
import { StyleSheet, View } from 'react-native';

import { storiesOf } from '@storybook/react-native';

import { Toast } from '../../../core-ui';

export default function toastStory() {
  return storiesOf('Toast', module).add('Toast', () => (
    <View style={style.container}>
      <Toast data={{ message: 'This is a toast', isVisible: true }} />
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
