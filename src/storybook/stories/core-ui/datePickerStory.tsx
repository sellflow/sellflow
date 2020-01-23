import React, { useState } from 'react';
import { storiesOf } from '@storybook/react-native';
import { View, SafeAreaView, Text } from 'react-native';
import { Button } from 'exoflex';
import { DatePicker } from '../../../core-ui';

export default function datePickerStory() {
  const DatepickerStory = () => {
    let [isVisible, setIsVisible] = useState(false);
    let [date, setDate] = useState('');

    return (
      <View>
        <Button preset="invisible" onPress={() => setIsVisible(true)}>
          Open DatePicker
        </Button>
        <DatePicker
          isVisible={isVisible}
          onCancel={() => setIsVisible(false)}
          onConfirm={(date: string) => {
            setDate(date);
            setIsVisible(false);
          }}
        />
        <Text>{date}</Text>
      </View>
    );
  };
  return storiesOf('Datepicker', module).add('Datepicker', () => (
    <SafeAreaView>
      <DatepickerStory />
    </SafeAreaView>
  ));
}
