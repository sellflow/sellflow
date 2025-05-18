import { useRef, useState } from "react";
import { View, PanResponder, GestureResponderEvent, Text } from "react-native";
import { useRanger, Ranger } from "@tanstack/react-ranger";
import { useLingui } from "@lingui/react/macro";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";

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
  const [values, setValues] = useState<ReadonlyArray<number>>([min, max]);
  const [activeHandleIndex, setActiveHandleIndex] = useState<number | null>(
    null,
  );
  const [trackWidth, setTrackWidth] = useState(0);
  const [trackLeft, setTrackLeft] = useState(0);
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

  // Calculate value from touch position
  const getValueFromPosition = (pageX: number) => {
    if (trackWidth === 0) return min;

    // Calculate relative position (0-1)
    const relativePosition = Math.max(
      0,
      Math.min(1, (pageX - trackLeft) / trackWidth),
    );

    // Map the position (0-1) to value range (min-max)
    const value = min + relativePosition * (max - min);

    // If stepSize is needed, round to nearest step
    return Math.round(value / 5) * 5;
  };

  // Create pan responders for each handle
  const createPanResponder = (handleIndex: number) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        setActiveHandleIndex(handleIndex);
      },

      onPanResponderMove: (evt: GestureResponderEvent) => {
        const { pageX } = evt.nativeEvent;
        const newValue = getValueFromPosition(pageX);

        // Create a new values array with the updated value for this handle
        const newValues = [...values];
        newValues[handleIndex] = newValue;

        // Sort the values to ensure they're in order
        const sortedValues = [...newValues].sort((a, b) => a - b);
        setValues(sortedValues);
      },

      onPanResponderRelease: () => {
        onValueChange(values[0], values[1]);
        setActiveHandleIndex(null);
      },

      onPanResponderTerminate: () => {
        setActiveHandleIndex(null);
      },
    });

  return (
    <>
      <Text style={styles.Price}>
        {i18n.number(values[0], { style: "currency", currency: "USD" })} -{" "}
        {values[1]}
      </Text>
      <View
        ref={rangerRef}
        style={styles.Track}
        onLayout={(event) => {
          const { width, x } = event.nativeEvent.layout;
          setTrackWidth(width);
          setTrackLeft(x);
        }}
      >
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
            },
          ]}
        />

        {/* Handles */}
        {rangerInstance.handles().map((handle, i) => {
          const panResponder = createPanResponder(i);

          return (
            <View
              key={i}
              role="slider"
              accessibilityRole="adjustable"
              accessibilityLabel={`Slider handle ${i + 1}`}
              accessibilityValue={{
                min: min,
                max: max,
                now: handle.value,
              }}
              style={[
                styles.Handle,
                {
                  left: `${rangerInstance.getPercentageForValue(handle.value)}%`,
                  transform: [{ translateX: -8 }], // Center the handle (half of width)
                  backgroundColor:
                    activeHandleIndex === i
                      ? UnistylesRuntime.colorScheme === "light"
                        ? "#0056B3"
                        : "#7EB6FF"
                      : UnistylesRuntime.colorScheme === "light"
                        ? "#007AFF"
                        : "#6F6F6F",
                },
              ]}
              {...panResponder.panHandlers}
            />
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  Price: {
    fontWeight: 600,
    paddingBottom: 16,
    paddingTop: 4,
    color: theme.colors.text,
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
    backgroundColor: theme.colors.tint,
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
}));
