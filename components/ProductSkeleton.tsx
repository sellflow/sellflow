import { Colors } from "@/constants/Colors";
import ContentLoader, { Rect } from "react-content-loader/native";
import { StyleSheet, View } from "react-native";
import { Dimensions, useColorScheme } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const imageSize = SCREEN_WIDTH > 640 ? 640 : SCREEN_WIDTH;

export default function ProductSkeleton() {
  const colorScheme = useColorScheme();

  return (
    <>
      <View style={styles.Container}>
        <ContentLoader
          backgroundColor={
            colorScheme === "light" ? Colors.light.border : Colors.dark.border
          }
          foregroundColor={colorScheme === "light" ? "#e0e0e0" : "#444444"}
          width={imageSize}
          height={imageSize}
        >
          <Rect x="0" y="0" width={imageSize} height={imageSize} />
        </ContentLoader>
        <View style={styles.InfoContainer}>
          <ContentLoader
            backgroundColor={
              colorScheme === "light" ? Colors.light.border : Colors.dark.border
            }
            foregroundColor={colorScheme === "light" ? "#e0e0e0" : "#444444"}
            width={imageSize}
            height={imageSize - 10}
          >
            <Rect
              x="16"
              y="64"
              rx="4"
              ry="4"
              width={imageSize - 60}
              height="40"
            />
            <Rect
              x="16"
              y="120"
              rx="4"
              ry="4"
              width={imageSize - 100}
              height="24"
            />
            <Rect
              x="16"
              y="160"
              rx="4"
              ry="4"
              width={imageSize - 16}
              height="16"
            />
            <Rect
              x="16"
              y="192"
              rx="4"
              ry="4"
              width={imageSize - 20}
              height="16"
            />
            <Rect
              x="16"
              y="224"
              rx="4"
              ry="4"
              width={imageSize - 24}
              height="16"
            />
            <Rect
              x="16"
              y="256"
              rx="4"
              ry="4"
              width={imageSize - 28}
              height="16"
            />
          </ContentLoader>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  Container: {
    flexDirection: SCREEN_WIDTH > 640 ? "row" : "column",
    gap: 32,
    width: "100%",
    maxWidth: SCREEN_WIDTH > 1175 ? 1175 : SCREEN_WIDTH,
  },
  InfoContainer: {
    width: SCREEN_WIDTH > 640 ? "40%" : "100%",
    paddingHorizontal: SCREEN_WIDTH > 640 ? 0 : 16,
  },
  TitleText: {
    fontSize: 40,
    fontWeight: "600",
    marginBottom: 16,
  },
  PriceText: {
    fontSize: 24,
    paddingVertical: 12,
  },
  OptionWrapper: {
    marginBottom: 8,
  },
  Option: {
    borderColor: "slategray",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    marginRight: 8,
  },
  OptionsScrollContainer: {
    flexGrow: 0,
    flexDirection: "row",
    flexWrap: "nowrap",
    paddingVertical: 4,
  },
  QuantitySelector: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 50,
    padding: 8,
  },
  AddToCartButton: {
    marginTop: 16,
    borderRadius: 4,
    backgroundColor: "coral",
    paddingVertical: 8,
    maxWidth: "100%",
  },
  BuyNowButton: {
    marginTop: 8,
    borderRadius: 4,
    backgroundColor: "orange",
    paddingVertical: 8,
    maxWidth: "100%",
  },
  Description: {
    maxWidth: "100%",
    paddingTop: 24,
  },
});
