import { getOptimizedImageUrl } from "@/lib/utils";
import { MediaEdge } from "@shopify/hydrogen-react/storefront-api-types";
import { Image } from "expo-image";
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  useAnimatedValue,
  View,
} from "react-native";
import { PartialObjectDeep } from "type-fest/source/partial-deep";

interface ImageCarouselProps {
  images:
    | (
        | PartialObjectDeep<
            MediaEdge,
            {
              allowUndefinedInNonTupleArrays: true;
              recurseIntoArrays: true;
            }
          >
        | undefined
      )[]
    | undefined;
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const scrollX = useAnimatedValue(0);
  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  console.log("IMAGE", images[0]);

  return (
    <View style={styles.ScrollContainer}>
      <ScrollView
        horizontal={true}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([
          { nativeEvent: { contentOffset: { x: scrollX } } },
        ])}
        scrollEventThrottle={1}
        style={{ flexGrow: 0, flex: 0 }}
      >
        {images &&
          images.map((image, index) => (
            <View
              style={{
                width: SCREEN_WIDTH > 640 ? 640 : SCREEN_WIDTH,
              }}
              key={index}
            >
              <Image
                source={{
                  uri: getOptimizedImageUrl(
                    image?.node?.image?.url,
                    SCREEN_WIDTH > 640 ? 640 : SCREEN_WIDTH,
                  ),
                }}
                style={{
                  width: SCREEN_WIDTH > 640 ? 640 : SCREEN_WIDTH,
                  height: SCREEN_WIDTH > 640 ? 640 : SCREEN_WIDTH,
                }}
              />
            </View>
          ))}
      </ScrollView>
      <View style={styles.indicatorContainer}>
        {images &&
          images.map((image, imageIndex) => {
            const width = scrollX.interpolate({
              inputRange: [
                SCREEN_WIDTH * (imageIndex - 1),
                SCREEN_WIDTH * imageIndex,
                SCREEN_WIDTH * (imageIndex + 1),
              ],
              outputRange: [8, 16, 8],
              extrapolate: "clamp",
            });
            return (
              <Animated.View
                key={imageIndex}
                style={[styles.normalDot, { width }]}
              />
            );
          })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ScrollContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  indicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  normalDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: "silver",
    marginHorizontal: 4,
  },
});
