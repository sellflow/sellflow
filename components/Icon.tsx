import { Ionicons } from "@expo/vector-icons";
import { withUnistyles } from "react-native-unistyles";

const Icon = withUnistyles(Ionicons, (theme) => ({
  color: theme.colors.text,
}));

export default Icon;
