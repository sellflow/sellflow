import { Filter } from "@shopify/hydrogen-react/storefront-api-types";
import { useContext, useRef } from "react";
import { Text, TouchableOpacity } from "react-native";
import { DropdownContext } from "./DropdownProvider";
import { Trans } from "@lingui/react/macro";
import { StyleSheet } from "react-native-unistyles";
import Icon from "./Icon";

export default function ProductFilter({
  filter: filterProp,
}: {
  filter: Filter | "sort";
}) {
  const { dropdownOpen, setDropdownOpen, setFilter, position, setPosition } =
    useContext(DropdownContext);
  const componentRef = useRef(null);

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
      style={styles.Filter}
      onPress={toggleDropdown}
      activeOpacity={0.6}
      ref={componentRef}
    >
      <Text style={styles.FilterLabel}>
        <Trans>{filterProp === "sort" ? "Sort by" : filterProp.label}</Trans>
      </Text>
      <Icon name="caret-down-outline" size={16} />
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create((theme) => ({
  Filter: {
    gap: 8,
    flexGrow: 0,
    flexDirection: "row",
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: "center",
    backgroundColor: theme.colors.text,
  },
  FilterLabel: {
    fontWeight: 600,
    color: theme.colors.background,
  },
}));
