import { Dispatch, useContext, useEffect, useRef, useState } from "react";
import { Platform, Text, View, Animated } from "react-native";
import { DropdownContext } from "./DropdownProvider";
import Checkbox from "expo-checkbox";
import {
  Filter,
  FilterValue,
  ProductFilter,
} from "@shopify/hydrogen-react/storefront-api-types";
import {
  Action,
  SortAction,
  SortReducerState,
} from "@/app/(tabs)/search/[query]";
import Slider from "./ui/Slider";
import { useNavigation } from "expo-router";
import { usePreventRemove } from "@react-navigation/native";
import RadioButtons from "./RadioButtons";
import { StyleSheet, withUnistyles } from "react-native-unistyles";

export default function FilterDropdown({
  state,
  dispatch,
  sortState,
  sortDispatch,
}: {
  state: ProductFilter[];
  dispatch: Dispatch<Action>;
  sortState: SortReducerState;
  sortDispatch: Dispatch<SortAction>;
}) {
  const [selectedId, setSelectedId] = useState("1");
  const { dropdownOpen, position, filter } = useContext(DropdownContext);
  const dropdownAnim = useRef(new Animated.Value(-25)).current;
  const dropdownOpacity = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  const toggleDropdownAnimation = () => {
    if (dropdownOpen) {
      Animated.parallel([
        Animated.timing(dropdownAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(dropdownOpacity, {
          toValue: 100,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(dropdownAnim, {
          toValue: -25,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(dropdownOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  usePreventRemove(
    filter !== "sort" && filter?.type === "PRICE_RANGE" && dropdownOpen,
    ({ data }) => {
      if (Platform.OS === "android") {
        console.log("WORKING");
      } else {
        navigation.dispatch(data.action);
      }
    },
  );

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled:
        filter !== "sort" && filter?.type === "PRICE_RANGE" && dropdownOpen,
    });
  }, [dropdownOpen, navigation]);
  useEffect(() => {
    toggleDropdownAnimation();
  }, [dropdownOpen]);

  useEffect(() => {
    switch (selectedId) {
      case "1": {
        sortDispatch({ type: "mostRelevant" });
        break;
      }
      case "2": {
        sortDispatch({ type: "leastRelevant" });
        break;
      }
      case "3": {
        sortDispatch({ type: "priceLowToHigh" });
        break;
      }
      case "4": {
        sortDispatch({ type: "priceHighToLow" });
        break;
      }
    }
  }, [selectedId]);

  return (
    <Animated.View
      style={[
        styles.DropdownContainer,
        {
          left: Platform.OS === "web" ? position?.x : 0,
          top: (position?.y || 0) + (position?.height || 0) + 40,
          transform: [{ translateY: dropdownAnim }],
          opacity: dropdownOpacity,
        },
      ]}
    >
      <Text style={styles.FilterHeading}>
        {filter === "sort" ? "Sort By" : filter?.label}
      </Text>
      <View>
        {filter === "sort" && (
          <View style={styles.CheckboxContainer}>
            <RadioButtons selectedId={selectedId} onPress={setSelectedId} />
          </View>
        )}
        {filter !== "sort" && filter?.type === "LIST"
          ? filter?.values?.map((value, index) => (
              <View key={index} style={styles.CheckboxContainer}>
                <FilterCheckbox
                  value={value}
                  state={state}
                  dispatch={dispatch}
                />
                <View style={styles.FilterInfo}>
                  <Text style={styles.FilterLabel}>{value?.label}</Text>
                  <Text style={styles.FilterCount}>{value?.count}</Text>
                </View>
              </View>
            ))
          : //@ts-ignore
            filter?.type === "PRICE_RANGE" && (
              <View style={styles.PriceContainer}>
                <PriceFilter
                  state={state}
                  dispatch={dispatch}
                  //@ts-ignore
                  filter={filter}
                />
              </View>
            )}
      </View>
    </Animated.View>
  );
}

// I am aware the file is slightly long and chaotic, however I figured it was better than adding another file for this not so large function
function PriceFilter({
  state,
  dispatch,
  filter,
}: {
  state: ProductFilter[];
  dispatch: Dispatch<Action>;
  filter: Filter | undefined;
}) {
  try {
    const input = JSON.parse(filter?.values[0]?.input as string);
    const min = input?.price?.min;
    const max = input?.price?.max;

    return (
      <Slider
        min={0}
        max={max}
        onValueChange={(low, high) =>
          dispatch({ type: "price", input: { min: low, max: high } })
        }
      />
    );
  } catch (e) {
    const min = 0;
    const max = 1000;
    return (
      <Slider
        min={min}
        max={max}
        onValueChange={(low, high) =>
          dispatch({ type: "price", input: { min: low, max: high } })
        }
      />
    );
  }
}
function FilterCheckbox({
  value,
  state,
  dispatch,
}: {
  value: FilterValue;
  state: ProductFilter[];
  dispatch: Dispatch<Action>;
}) {
  const getValue = () => {
    /**
      getValue searches for an element inside of the useReducer state that has the same key-value pair as the FilterValue
      input and returns the index if the value exists thus giving the checkbox its value and allows it to hightlight blue if checked
     */
    try {
      const input = JSON.parse(value.input as string);
      const [key] = Object.keys(JSON.parse(value.input as string));

      //@ts-ignore
      return state.findIndex((el) => el[key] === input[key]) > -1;
    } catch (e) {
      console.error(e);
      return false;
    }
  };
  const checkboxValue = getValue();

  const toggleFilter = () => {
    try {
      // Include the value only if checkboxValue is false (the key-value pair is not already present in array)
      if (!checkboxValue) {
        const input = JSON.parse(value.input as string);
        dispatch({ type: "include", input });
        console.log(state);
      } else {
        const input = JSON.parse(value.input as string);
        dispatch({ type: "remove", input });
        console.log(state);
      }
    } catch (e) {
      console.error(e);
      return;
    }
  };

  return (
    <UniCheckbox value={checkboxValue} onValueChange={() => toggleFilter()} />
  );
}

const UniCheckbox = withUnistyles(Checkbox, (theme) => ({
  color: theme.colors.primary,
}));

const styles = StyleSheet.create((theme) => ({
  DropdownContainer: {
    position: "absolute",
    width: {
      xs: "100%",
      md: "auto",
    },
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    padding: 12,
    borderRadius: 4,
    borderWidth: 2,
    gap: 8,
    zIndex: 1,
  },
  FilterHeading: {
    fontWeight: 600,
    color: theme.colors.text,
  },
  FilterLabel: {
    color: theme.colors.text,
  },
  FilterCount: {
    fontWeight: 600,
    marginLeft: "auto",
    color: theme.colors.tabIconDefault,
  },
  CheckboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  FilterInfo: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    gap: 64,
  },
  PriceContainer: {
    minWidth: 200,
  },
}));
