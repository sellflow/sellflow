import { Colors } from "@/constants/Colors";
import { getOptimizedImageUrl } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { MediaEdge } from "@shopify/hydrogen-react/storefront-api-types";
import { Image } from "expo-image";
import { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
  PanResponder,
  Platform,
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
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const imageWidth = SCREEN_WIDTH > 640 ? 640 : SCREEN_WIDTH;
  const [currentIndex, setCurrentIndex] = useState(0);

  // Calculate total number of images
  const totalImages = images?.length || 0;

  // Create a PanResponder for handling swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        // Track horizontal movement
        return true;
      },
      onPanResponderRelease: (_, gestureState) => {
        // Detect swipe direction
        if (gestureState.dx < -50 && currentIndex < totalImages - 1) {
          // Swipe left -> next image
          const nextIndex = currentIndex + 1;
          scrollToImage(nextIndex);
        } else if (gestureState.dx > 50 && currentIndex > 0) {
          // Swipe right -> previous image
          const prevIndex = currentIndex - 1;
          scrollToImage(prevIndex);
        }
        return true;
      },
    }),
  ).current;

  // Function to scroll to a specific image
  const scrollToImage = (index: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: index * imageWidth,
        animated: true,
      });
      setCurrentIndex(index);
    }
  };

  // Handle scroll end to update current index
  const handleMomentumScrollEnd = (event: any) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / imageWidth);
    setCurrentIndex(newIndex);
  };

  // Create navigation buttons for better web experience
  const renderNavButtons = () => {
    if (Platform.OS === "web" && totalImages > 1) {
      return (
        <View style={styles.navButtonsContainer}>
          <View
            style={[
              styles.navButton,
              styles.navButtonLeft,
              currentIndex === 0 ? styles.navButtonDisabled : {},
            ]}
            onClick={() => currentIndex > 0 && scrollToImage(currentIndex - 1)}
          >
            <View style={styles.navArrow}>
              <Ionicons size={16} name="arrow-back-sharp" color="#fff" />
            </View>
          </View>
          <View
            style={[
              styles.navButton,
              styles.navButtonRight,
              currentIndex === totalImages - 1 ? styles.navButtonDisabled : {},
            ]}
            onClick={() =>
              currentIndex < totalImages - 1 && scrollToImage(currentIndex + 1)
            }
          >
            <View style={styles.navArrow}>
              <Ionicons size={16} name="arrow-forward-sharp" color="#fff" />
            </View>
          </View>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.ScrollContainer}>
      <View
        style={{
          width: imageWidth,
          position: "relative",
        }}
        {...(Platform.OS === "web" ? panResponder.panHandlers : {})}
      >
        <ScrollView
          ref={scrollViewRef}
          horizontal={true}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false },
          )}
          scrollEventThrottle={16}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          style={{
            width: imageWidth,
          }}
          contentContainerStyle={{
            userSelect: "none", // Prevents text selection on web
          }}
        >
          {images &&
            images.map((image, index) => (
              <View
                style={{
                  width: imageWidth,
                  position: "relative",
                }}
                key={index}
              >
                <Image
                  source={{
                    uri: getOptimizedImageUrl(
                      image?.node?.image?.url,
                      imageWidth,
                    ),
                  }}
                  style={{
                    width: imageWidth,
                    height: imageWidth,
                    backgroundColor: Colors.light.background,
                    userSelect: "none", // Prevents text selection on web
                  }}
                  contentFit="cover"
                />
              </View>
            ))}
        </ScrollView>
        {renderNavButtons()}
      </View>
      <View style={styles.indicatorContainer}>
        {images &&
          images.length > 1 &&
          images.map((image, imageIndex) => {
            const width = scrollX.interpolate({
              inputRange: [
                imageWidth * (imageIndex - 1),
                imageWidth * imageIndex,
                imageWidth * (imageIndex + 1),
              ],
              outputRange: [8, 16, 8],
              extrapolate: "clamp",
            });
            return (
              <Animated.View
                key={imageIndex}
                style={[styles.normalDot, { width }]}
                onClick={() => scrollToImage(imageIndex)}
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
    position: "relative",
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
    cursor: "pointer",
  },
  navButtonsContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    pointerEvents: "none",
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    pointerEvents: "auto",
    cursor: "pointer",
  },
  navButtonLeft: {
    marginRight: "auto",
  },
  navButtonRight: {
    marginLeft: "auto",
  },
  navButtonDisabled: {
    opacity: 0.3,
    cursor: "default",
  },
  navArrow: {
    color: "white",
    fontSize: 24,
    lineHeight: 24,
    textAlign: "center",
  },
});
