import { Colors } from "@/constants/Colors";
import ContentLoader, { Circle, Rect } from "react-content-loader/native";
import { useColorScheme } from "react-native";

export default function ProfileSkeleton() {
  const colorScheme = useColorScheme();

  return (
    <>
      <ContentLoader
        backgroundColor={
          colorScheme === "light" ? Colors.light.border : Colors.dark.border
        }
        foregroundColor={colorScheme === "light" ? "#e0e0e0" : "#444444"}
        width="100%"
        height="100%"
      >
        <Circle cx="50%" cy="40%" r="48" />
        <Rect x="25%" y="50%" width="200" height="16" rx="4" ry="4" />
        <Rect x="0" y="55%" width="47.5%" height="28" rx="4" ry="4" />
        <Rect x="52.5%" y="55%" width="47.5%" height="28" rx="4" ry="4" />
        <Rect x="0" y="60%" width="47.5%" height="28" rx="4" ry="4" />
        <Rect x="52.5%" y="60%" width="47.5%" height="28" rx="4" ry="4" />
      </ContentLoader>
    </>
  );
}
