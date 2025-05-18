import ContentLoader, { Circle, Rect } from "react-content-loader/native";
import { withUnistyles } from "react-native-unistyles";

const UniContentLoader = withUnistyles(ContentLoader, (theme) => ({
  backgroundColor: theme.colors.background,
  foregroundColor: theme.colors.tabIconDefault,
}));

export default function ProfileSkeleton() {
  return (
    <>
      <UniContentLoader width="100%" height="100%">
        <Circle cx="50%" cy="40%" r="48" />
        <Rect x="25%" y="50%" width="200" height="16" rx="4" ry="4" />
        <Rect x="0" y="55%" width="47.5%" height="28" rx="4" ry="4" />
        <Rect x="52.5%" y="55%" width="47.5%" height="28" rx="4" ry="4" />
        <Rect x="0" y="60%" width="47.5%" height="28" rx="4" ry="4" />
        <Rect x="52.5%" y="60%" width="47.5%" height="28" rx="4" ry="4" />
      </UniContentLoader>
    </>
  );
}
