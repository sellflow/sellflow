import { Colors } from "@/constants/Colors";
import { useCallback } from "react";
import {
  ColorSchemeName,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import RangeSlider from "rn-range-slider";

const THUMB_RADIUS_LOW = 12;

export default function Slider({
  min,
  max,
  onValueChanged,
}: {
  min: number;
  max: number;
  onValueChanged: (low: number, high: number) => void;
}) {
  const colorScheme = useColorScheme();
  return (
    <RangeSlider
      min={min}
      max={max}
      step={1}
      floatingLabel
      renderLabel={useCallback(
        (value: number) => (
          <Label text={value} colorScheme={colorScheme} />
        ),
        [],
      )}
      renderRail={useCallback(
        () => (
          <Rail />
        ),
        [],
      )}
      renderRailSelected={useCallback(
        () => (
          <RailSelected colorScheme={colorScheme} />
        ),
        [],
      )}
      renderThumb={useCallback(
        () => (
          <Thumb colorScheme={colorScheme} />
        ),
        [],
      )}
      onValueChanged={onValueChanged}
    />
  );
}

const Rail = () => {
  return <View style={styles.root} />;
};

const RailSelected = ({ colorScheme }: { colorScheme: ColorSchemeName }) => {
  return (
    <View
      style={[
        styles.RailSelected,
        {
          backgroundColor:
            colorScheme === "light"
              ? Colors.light.primary
              : Colors.dark.primary,
        },
      ]}
    />
  );
};

const Thumb = ({ colorScheme }: { colorScheme: ColorSchemeName }) => {
  return (
    <View
      style={[
        styles.rootLow,
        {
          backgroundColor:
            colorScheme === "light" ? Colors.light.border : Colors.dark.border,
          borderColor:
            colorScheme === "light" ? Colors.light.border : Colors.dark.border,
        },
      ]}
    />
  );
};

const Label = ({
  text,
  colorScheme,
  ...restProps
}: {
  text: number;
  colorScheme: ColorSchemeName;
}) => {
  return (
    <View
      style={[
        styles.textRoot,
        {
          backgroundColor:
            colorScheme === "light"
              ? Colors.dark.background
              : Colors.light.background,
        },
      ]}
      {...restProps}
    >
      <Text
        style={[
          styles.textRoot,
          {
            color:
              colorScheme === "light" ? Colors.dark.text : Colors.light.text,
          },
        ]}
      >
        {String(text)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#7f7f7f",
    pointerEvents: "none",
  },
  RailSelected: {
    height: 4,
    borderRadius: 2,
  },
  rootLow: {
    width: THUMB_RADIUS_LOW * 2,
    height: THUMB_RADIUS_LOW * 2,
    borderRadius: THUMB_RADIUS_LOW,
    borderWidth: 2,
  },
  textRoot: {
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
});
