import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { View, StyleSheet, Text } from 'react-native';

import { Avatar } from '../../../core-ui';

export default function avatarStory() {
  return storiesOf('Avatar', module).add('Avatar', () => (
    <View style={styles.container}>
      <View style={styles.center}>
        <Avatar firstName="Anna" lastName="Belle" size={64} />
        <Text>Anna Belle</Text>
      </View>
      <View style={styles.center}>
        <Avatar firstName="John" lastName="Petrucci" size={52} />
        <Text>John Petrucci</Text>
      </View>
      <View style={styles.center}>
        <Avatar firstName="Herry" lastName="Guang" size={30} />
        <Text>Herry Guang</Text>
      </View>
    </View>
  ));
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
