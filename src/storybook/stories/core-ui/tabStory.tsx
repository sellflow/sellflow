import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { View, StyleSheet } from 'react-native';

import { TabView } from '../../../core-ui';
import { TabRoute } from '../../../core-ui/TabView';
import { useDimensions } from '../../../helpers/dimensions';

export default function tabStory() {
  let TabStory = () => {
    let dimensions = useDimensions();

    const FirstRoute = () => (
      <View
        style={[
          styles.tabBoxContainer,
          { backgroundColor: '#ff4081', width: dimensions.width },
        ]}
      />
    );

    const SecondRoute = () => (
      <View
        style={[
          styles.tabBoxContainer,
          { backgroundColor: '#673ab7', width: dimensions.width },
        ]}
      />
    );
    const ThirdRoute = () => (
      <View
        style={[
          styles.tabBoxContainer,
          { backgroundColor: 'green', width: dimensions.width },
        ]}
      />
    );

    const routes: Array<TabRoute> = [
      { key: 'first', title: 'Descriptions', scene: FirstRoute },
      { key: 'second', title: 'This is a Title', scene: SecondRoute },
      { key: 'third', title: 'this is a third screen', scene: ThirdRoute },
    ];

    return <TabView routes={routes} />;
  };

  return storiesOf('TabView', module).add('TabView', () => <TabStory />);
}

const styles = StyleSheet.create({
  tabBoxContainer: {
    height: 100,
  },
});
