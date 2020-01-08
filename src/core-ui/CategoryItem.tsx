import React from 'react';
import {
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { Text } from 'exoflex';

import { COLORS } from '../general/constants/colors';
import { FONT_SIZE } from '../general/constants/fonts';

// TODO: Find how to get the image from API, because I only get the category
// without the image
type CategoryProps = {
  node: string;
  imageSrc?: string;
};

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  data: Array<CategoryProps>;
  onSelect: (value: string) => void;
};

export default function CategoryItem(props: Props) {
  let { containerStyle, textStyle, data, onSelect } = props;

  let Separator = () => <View style={styles.separator} />;

  return (
    <FlatList
      bounces={false}
      horizontal={true}
      contentContainerStyle={styles.container}
      data={data}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[styles.categoryItemContainer, containerStyle]}
          onPress={() => onSelect(item.node)}
        >
          {item.imageSrc && (
            <ImageBackground
              source={{ uri: item.imageSrc }}
              resizeMode="cover"
              blurRadius={5}
              style={styles.imageBackground}
            />
          )}
          <Text weight="medium" style={[styles.categoryItemText, textStyle]}>
            {item.node}
          </Text>
        </TouchableOpacity>
      )}
      ItemSeparatorComponent={Separator}
      keyExtractor={(item) => item.node}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryItemContainer: {
    height: 48,
    borderRadius: 2,
    backgroundColor: COLORS.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryItemText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.medium,
    marginHorizontal: 12,
  },
  separator: {
    marginHorizontal: 6,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 0,
  },
});
