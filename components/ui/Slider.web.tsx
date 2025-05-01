import { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  useColorScheme,
  Text,
  Pressable,
} from "react-native";
import { useRanger, Ranger } from "@tanstack/react-ranger";
import { useLingui } from "@lingui/react/macro";
import { Colors } from "@/constants/Colors";

export default function Slider({
  min,
  max,
  onValueChange,
}: {
  min: number;
  max: number;
  onValueChange: (low: number, high: number) => void;
}) {
  const rangerRef = useRef<View>(null);
  const colorScheme = useColorScheme();
  const [values, setValues] = useState<ReadonlyArray<number>>([min, max]);
  const { i18n } = useLingui();

  const rangerInstance = useRanger<View>({
    getRangerElement: () => rangerRef.current,
    values,
    min,
    max,
    stepSize: 5,
    onChange: (instance: Ranger<View>) => {
      setValues(instance.sortedValues);
      onValueChange(instance.sortedValues[0], instance.sortedValues[1]);
    },
  });

  return (
    <>
      <Text
        style={[
          styles.Price,
          {
            color:
              colorScheme === "light" ? Colors.light.text : Colors.dark.text,
          },
        ]}
      >
        {i18n.number(values[0], { style: "currency", currency: "USD" })} -{" "}
        {values[1]}
      </Text>
      <View ref={rangerRef} style={styles.Track}>
        {/* Track segment between handles */}
        <View
          style={[
            styles.TrackSegment,
            {
              left: `${rangerInstance.getPercentageForValue(values[0])}%`,
              width: `${
                rangerInstance.getPercentageForValue(values[1]) -
                rangerInstance.getPercentageForValue(values[0])
              }%`,
              backgroundColor: colorScheme === "dark" ? "#555" : "#007AFF",
            },
          ]}
        />

        {/* Handles */}
        {rangerInstance
          .handles()
          .map(({ value, isActive, onTouchStart }, i) => {
            return (
              <Pressable
                key={i}
                role="slider"
                accessibilityRole="adjustable"
                accessibilityLabel={`Slider handle ${i + 1}`}
                accessibilityValue={{
                  min: min,
                  max: max,
                  now: value,
                }}
                onPressIn={onTouchStart}
                style={[
                  styles.Handle,
                  {
                    left: `${rangerInstance.getPercentageForValue(value)}%`,
                    transform: [{ translateX: -8 }], // Center the handle (half of width)
                    backgroundColor: isActive
                      ? colorScheme === "light"
                        ? "#0056B3"
                        : "#7EB6FF"
                      : colorScheme === "light"
                        ? "#007AFF"
                        : "#6F6F6F",
                  },
                ]}
              />
            );
          })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  Price: {
    fontWeight: 600,
    paddingBottom: 16,
    paddingTop: 4,
  },
  Track: {
    position: "relative",
    height: 4,
    backgroundColor: "#ddd",
    borderRadius: 2,
    marginVertical: 16,
  },
  TrackSegment: {
    position: "absolute",
    height: "100%",
    borderRadius: 2,
  },
  Handle: {
    position: "absolute",
    top: -6, // Center vertically relative to track
    width: 16,
    height: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    zIndex: 1, // Ensure handles are above the track
  },
});
