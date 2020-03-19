import React from 'react';
import {
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  FlatList,
  TouchableOpacity,
  FlatListProps,
  ImageBackground,
} from 'react-native';
import { Text } from 'exoflex';

import { COLORS } from '../constants/colors';
import { FONT_SIZE } from '../constants/fonts';
import { CategoryItem } from '../types/types';

type BaseProps = FlatListProps<CategoryItem>;

type Props = Omit<BaseProps, 'data' | 'renderItem' | 'numColumns'> & {
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  categories: Array<CategoryItem>;
  onSelect: (category: CategoryItem) => void;
};

function Separator() {
  return <View style={styles.separator} />;
}

export default function CategoryList(props: Props) {
  let {
    containerStyle,
    textStyle,
    categories,
    onSelect,
    ...otherprops
  } = props;

  return (
    <FlatList
      showsHorizontalScrollIndicator={false}
      horizontal={true}
      data={categories}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.categoryItemContainer,
            styles.borderRadius,
            !item.image && styles.color,
            containerStyle,
          ]}
          onPress={() => onSelect(item)}
        >
          {item.image ? (
            <ImageBackground
              source={{ uri: item.image }}
              imageStyle={styles.borderRadius}
              style={styles.categoryItemContainer}
            >
              <Text
                weight="medium"
                style={[styles.categoryItemText, textStyle]}
              >
                {item.title}
              </Text>
            </ImageBackground>
          ) : (
            <Text weight="medium" style={[styles.categoryItemText, textStyle]}>
              {item.title}
            </Text>
          )}
        </TouchableOpacity>
      )}
      ItemSeparatorComponent={Separator}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.flatlistContainer}
      {...otherprops}
    />
  );
}

const styles = StyleSheet.create({
  categoryItemContainer: {
    flex: 1,
    height: 48,
    minWidth: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  borderRadius: {
    borderRadius: 2,
  },
  color: {
    backgroundColor: COLORS.primaryColor,
  },
  categoryItemText: {
    marginHorizontal: 12,
    color: COLORS.white,
    fontSize: FONT_SIZE.medium,
  },
  separator: {
    marginHorizontal: 6,
  },
  flatlistContainer: {
    paddingStart: 24,
    paddingEnd: 24,
  },
});
