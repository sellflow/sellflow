import ContentLoader, { Rect } from "react-content-loader/native";
import { StyleSheet, View } from "react-native";
import { UnistylesRuntime, withUnistyles } from "react-native-unistyles";

const imageSize =
  UnistylesRuntime.screen.width > 640 ? 640 : UnistylesRuntime.screen.width;

const UniContentLoader = withUnistyles(ContentLoader, (theme) => ({
  backgroundColor: theme.colors.border,
  forgroundColor: theme.colors.tabIconDefault,
}));

export default function ProductSkeleton() {
  return (
    <>
      <View style={styles.Container}>
        <UniContentLoader width={imageSize} height={imageSize}>
          <Rect x="0" y="0" width={imageSize} height={imageSize} />
        </UniContentLoader>
        <View style={styles.InfoContainer}>
          <UniContentLoader width={imageSize} height={imageSize - 10}>
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
          </UniContentLoader>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  Container: {
    flexDirection: UnistylesRuntime.screen.width > 640 ? "row" : "column",
    gap: 32,
    width: "100%",
    maxWidth:
      UnistylesRuntime.screen.width > 1175
        ? 1175
        : UnistylesRuntime.screen.width,
  },
  InfoContainer: {
    width: UnistylesRuntime.screen.width > 640 ? "40%" : "100%",
    paddingHorizontal: UnistylesRuntime.screen.width > 640 ? 0 : 16,
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
