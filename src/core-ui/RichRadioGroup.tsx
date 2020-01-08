import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  TextStyle,
  FlatList,
} from 'react-native';
import { Text } from 'exoflex';

import { COLORS } from '../general/constants/colors';
import { FONT_SIZE } from '../general/constants/fonts';

type Options = {
  name: string;
  values: Array<string>;
};

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  buttonContainerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  data: Array<Options>;
  onSelect: (value: string) => void;
};

function OptionButton(objData: Options, props: Props) {
  let { buttonContainerStyle, textStyle, onSelect } = props;

  let [activeIndex, setActiveIndex] = useState(0);

  return (
    <FlatList
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      style={styles.radioGroupContainer}
      data={objData.values}
      renderItem={({ item, index }) => {
        let isActive = activeIndex === index;

        let separatorStyle = {
          marginLeft: index !== 0 ? 16 : 0,
        } as StyleProp<ViewStyle>;

        let buttonContainer = [
          styles.buttonContainer,
          isActive && styles.activeButton,
        ];

        let onPressButton = () => {
          onSelect(item);
          setActiveIndex(index);
        };

        return (
          <TouchableOpacity
            key={index}
            style={[buttonContainer, buttonContainerStyle, separatorStyle]}
            onPress={onPressButton}
          >
            <Text style={[styles.text, textStyle]}>{item}</Text>
          </TouchableOpacity>
        );
      }}
      keyExtractor={(item) => item.toString()}
    />
  );
}

export default function RichRadioGroup(props: Props) {
  let { containerStyle, data } = props;

  return (
    <View style={[styles.container, containerStyle]}>
      {data.map((item, index) => {
        return (
          <View key={index}>
            <Text style={styles.categoryTitle}>{item.name}</Text>
            {OptionButton(item, props)}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
  },
  buttonContainer: {
    minWidth: 48,
    height: 48,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 1,
    borderColor: COLORS.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
  },
  activeButton: {
    borderColor: COLORS.primaryColor,
  },
  text: {
    fontSize: FONT_SIZE.medium,
  },
  radioGroupContainer: {
    maxHeight: 48,
    marginBottom: 16,
  },
  categoryTitle: {
    opacity: 0.6,
    marginBottom: 12,
  },
});
