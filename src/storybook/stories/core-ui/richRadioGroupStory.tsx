import React, { useState } from 'react';
import { storiesOf } from '@storybook/react-native';
import { StyleSheet, SafeAreaView } from 'react-native';

import { RichRadioGroup } from '../../../core-ui';

const data = [
  { name: 'Size', values: ['S', 'M', 'L', 'XL'] },
  {
    name: 'Color',
    values: ['Brown', 'Blue', 'Black', 'Red', 'Green', 'Yellow'],
  },
];

type Props = {
  name: string;
  values: Array<string>;
};

function RadioGroupWithState(props: Props) {
  let { name, values } = props;
  let [selectedValue, setSelectedValue] = useState<string>(values[0]);
  return (
    <RichRadioGroup
      name={name}
      values={values}
      selectedValue={selectedValue}
      onSelect={(value) => setSelectedValue(value)}
    />
  );
}

export default function richRadioGroupStory() {
  return storiesOf('Rich Radio Group', module).add('Rich Radio Group', () => (
    <SafeAreaView style={style.container}>
      {data.map((item, index) => (
        <RadioGroupWithState
          key={index}
          name={item.name}
          values={item.values}
        />
      ))}
    </SafeAreaView>
  ));
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
