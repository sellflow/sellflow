import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Filter } from "@shopify/hydrogen-react/storefront-api-types";
import { useContext, useRef } from "react";
import {
  ColorSchemeName,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { DropdownContext } from "./DropdownProvider";
import { Trans } from "@lingui/react/macro";

export default function ProductFilter({
  filter: filterProp,
  colorScheme,
}: {
  filter: Filter | "sort";
  colorScheme: ColorSchemeName;
}) {
  const { dropdownOpen, setDropdownOpen, setFilter, position, setPosition } =
    useContext(DropdownContext);
  const componentRef = useRef(null);
  const oppositeTextColor =
    colorScheme === "light" ? Colors.dark.text : Colors.light.text;
  const oppositeBackgroundColors =
    colorScheme === "light" ? Colors.dark.background : Colors.light.background;

  const toggleDropdown = () => {
    if (componentRef.current) {
      //@ts-ignore
      componentRef.current?.measure(
        (x: number, y: number, width: number, height: number) => {
          if (dropdownOpen && position?.x !== x) {
            setDropdownOpen(false);
            setPosition({ x, y, height });
            setFilter(filterProp);
            setDropdownOpen(true);
          } else {
            setPosition({ x, y, height });
            setFilter(filterProp);
            setDropdownOpen(!dropdownOpen);
          }
        },
      );
    }
  };

  return (
    <TouchableOpacity
      style={[styles.Filter, { backgroundColor: oppositeBackgroundColors }]}
      onPress={toggleDropdown}
      activeOpacity={0.6}
      ref={componentRef}
    >
      <Text style={[{ color: oppositeTextColor, fontWeight: 600 }]}>
        <Trans>{filterProp === "sort" ? "Sort by" : filterProp.label}</Trans>
      </Text>
      <Ionicons name="caret-down-outline" size={16} color={oppositeTextColor} />
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  Filter: {
    gap: 8,
    flexGrow: 0,
    flexDirection: "row",
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: "center",
  },
});
