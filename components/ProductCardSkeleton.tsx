import { Colors } from "@/constants/Colors";
import ContentLoader, { Rect } from "react-content-loader/native";
import { Dimensions, useColorScheme } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const imageSize = SCREEN_WIDTH > 640 ? 290 : SCREEN_WIDTH / 2 - 12;

export default function ProductCardSkeleton() {
  const colorScheme = useColorScheme();

  return (
    <ContentLoader
      backgroundColor={
        colorScheme === "light" ? Colors.light.border : Colors.dark.border
      }
      foregroundColor={colorScheme === "light" ? "#e0e0e0" : "#444444"}
      width={imageSize}
      height={imageSize + 62}
    >
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
    </ContentLoader>
  );
}
