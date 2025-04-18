import { Dispatch, useCallback, useContext, useEffect, useRef } from "react";
import {
  ColorSchemeName,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  Animated,
} from "react-native";
import { DropdownContext } from "./DropdownProvider";
import { Colors } from "@/constants/Colors";
import Checkbox from "expo-checkbox";
import {
  Filter,
  FilterValue,
  ProductFilter,
} from "@shopify/hydrogen-react/storefront-api-types";
import { Action } from "@/app/(tabs)/search/[query]";
import RangeSlider from "rn-range-slider";
import Slider from "./ui/Slider";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function FilterDropdown({
  colorScheme,
  state,
  dispatch,
}: {
  colorScheme: ColorSchemeName;
  state: ProductFilter[];
  dispatch: Dispatch<Action>;
}) {
  const { dropdownOpen, position, filter } = useContext(DropdownContext);
  const dropdownAnim = useRef(new Animated.Value(-25)).current;
  const dropdownOpacity = useRef(new Animated.Value(0)).current;
  const backgroundColor =
    colorScheme === "light" ? Colors.light.background : Colors.dark.background;
  const textColor =
    colorScheme === "light" ? Colors.light.text : Colors.dark.text;
  const gray =
    colorScheme === "light"
      ? Colors.light.tabIconDefault
      : Colors.dark.tabIconDefault;

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

  useEffect(() => {
    toggleDropdownAnimation();
  }, [dropdownOpen]);

  return (
    <Animated.View
      style={[
        styles.DropdownContainer,
        {
          left: Platform.OS === "web" ? position?.x : 0,
          top: (position?.y || 0) + (position?.height || 0) + 40,
          borderColor:
            colorScheme === "light" ? Colors.light.border : Colors.dark.border,
          backgroundColor,
          transform: [{ translateY: dropdownAnim }],
          opacity: dropdownOpacity,
        },
      ]}
    >
      <Text style={[styles.FilterHeading, { color: textColor }]}>
        {filter?.label}
      </Text>
      <View>
        {filter?.type === "LIST"
          ? filter?.values?.map((value, index) => (
              <View key={index} style={styles.CheckboxContainer}>
                <FilterCheckbox
                  value={value}
                  state={state}
                  dispatch={dispatch}
                  colorScheme={colorScheme}
                />
                <View style={styles.FilterInfo}>
                  <Text style={[{ color: textColor }]}>{value?.label}</Text>
                  <Text
                    style={{
                      fontWeight: 600,
                      marginLeft: "auto",
                      color: gray,
                    }}
                  >
                    {value?.count}
                  </Text>
                </View>
              </View>
            ))
          : filter?.type === "PRICE_RANGE" && (
              <View style={styles.PriceContainer}>
                <PriceFilter
                  state={state}
                  dispatch={dispatch}
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
  let sliderTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  // canUse variable is in place because the Slider library being used calls handleValueChange on first render as soon as user opens dropdown
  // to prevent this the variable canUse is in place so that the first time the function is called it immediately returns and sets the value
  // to true so and subsequent calls to the callback function process normally
  let canUse = false;

  const handleValueChange = useCallback((low: number, high: number) => {
    if (!canUse) {
      canUse = true;
      return;
    }
    if (sliderTimeout) {
      clearTimeout(sliderTimeout.current);
    }

    sliderTimeout.current = setTimeout(() => {
      dispatch({ type: "price", input: { min: low, max: high } });
    }, 750);
  }, []);

  try {
    const input = JSON.parse(filter?.values[0]?.input as string);
    const min = input?.price?.min;
    const max = input?.price?.max;

    return <Slider min={min} max={max} onValueChanged={handleValueChange} />;
  } catch (e) {
    const min = 0;
    const max = 1000;
    return <Slider min={min} max={max} onValueChanged={handleValueChange} />;
  }
}
function FilterCheckbox({
  value,
  state,
  dispatch,
  colorScheme,
}: {
  value: FilterValue;
  state: ProductFilter[];
  dispatch: Dispatch<Action>;
  colorScheme: ColorSchemeName;
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
    <Checkbox
      color={
        colorScheme === "light" ? Colors.light.primary : Colors.dark.primary
      }
      value={checkboxValue}
      onValueChange={() => toggleFilter()}
    />
  );
}

const styles = StyleSheet.create({
  DropdownContainer: {
    position: "absolute",
    width: SCREEN_WIDTH > 640 ? "auto" : "100%",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 4,
    borderWidth: 2,
    gap: 8,
    zIndex: 1,
  },
  FilterHeading: {
    fontWeight: 600,
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
});
