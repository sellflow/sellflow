import React, { useState } from 'react';
import {
  StyleSheet,
  ImageBackground,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  default as SnapCarousel,
  Pagination,
} from 'react-native-snap-carousel';

import { COLORS } from '../constants/colors';
import { CarouselItem } from '../types/types';
import { useDimensions } from '../helpers/dimensions';

type Props = {
  data: Array<CarouselItem>;
  width?: number;
  height: number;
};

export default function Carousel(props: Props) {
  let dimensions = useDimensions();
  let { data, width = dimensions.width, height } = props;
  let [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <View style={[styles.carouselContainer, { height }]}>
      <SnapCarousel
        data={data}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback onPress={item.onItemPress}>
            <ImageBackground
              source={{ uri: item.image }}
              style={[styles.itemContainer, { height }]}
            >
              {item.render && item.render()}
            </ImageBackground>
          </TouchableWithoutFeedback>
        )}
        sliderWidth={width}
        itemWidth={width}
        inactiveSlideScale={1}
        onSnapToItem={(slideIndex: number) => setActiveIndex(slideIndex)}
      />
      <Pagination
        dotsLength={data.length}
        activeDotIndex={activeIndex}
        containerStyle={styles.pagination}
        dotStyle={styles.activeDotStyle}
        inactiveDotStyle={styles.inactiveDotStyle}
        inactiveDotOpacity={0.4}
        dotContainerStyle={styles.dotContainerStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'contain',
  },
  carouselContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  pagination: {
    position: 'absolute',
    bottom: -20,
  },
  dotContainerStyle: {
    marginHorizontal: 1,
  },
  activeDotStyle: {
    width: 20,
    height: 6,
    borderRadius: 5,
    opacity: 0.92,
    backgroundColor: COLORS.white,
  },
  inactiveDotStyle: {
    width: 11,
    height: 11,
    borderRadius: 5,
    opacity: 0.92,
    backgroundColor: COLORS.white,
  },
});
