import ContentLoader, { Rect } from "react-content-loader/native";
import { UnistylesRuntime, withUnistyles } from "react-native-unistyles";

const imageSize =
  UnistylesRuntime.screen.width > 640
    ? 290
    : UnistylesRuntime.screen.width / 2 - 12;

const UniContentLoader = withUnistyles(ContentLoader, (theme) => ({
  backgroundColor: theme.colors.border,
  foregroundColor: theme.colors.tabIconDefault,
}));

export default function ProductCardSkeleton() {
  return (
    <UniContentLoader width={imageSize} height={imageSize + 62}>
      <Rect x="0" y="0" rx="4" ry="4" width={imageSize} height={imageSize} />
      <Rect
        x="0"
        y={imageSize + 8}
        rx="4"
        ry="4"
        width={imageSize - 20}
        height="14"
      />
      <Rect
        x="0"
        y={imageSize + 26}
        rx="4"
        ry="4"
        width={imageSize - 120}
        height="14"
      />
    </UniContentLoader>
  );
}
