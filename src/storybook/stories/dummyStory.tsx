import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { View, StyleSheet, Text } from 'react-native';

export default function dummyStory() {
  storiesOf('CenteredView', module).add('default view', () => (
    <View style={style.root}>
      <Text>Hello Storybook</Text>
    </View>
  ));
}

const style = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
