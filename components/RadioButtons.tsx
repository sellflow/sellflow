import { useMemo } from "react";
import { RadioButtonProps, RadioGroup } from "react-native-radio-buttons-group";
import { useUnistyles } from "react-native-unistyles";

export default function RadioButtons({
  onPress,
  selectedId,
}: {
  onPress: any;
  selectedId: any;
}) {
  const { theme } = useUnistyles();
  const sortButtons = useMemo<RadioButtonProps[]>(
    () => [
      {
        id: "1",
        label: "Most relevant",
        value: "mostRelevant",
        color: theme.colors.primary,
      },
      {
        id: "2",
        label: "Least Relevant",
        value: "leastRelevant",
        color: theme.colors.primary,
      },
      {
        id: "3",
        label: "Price low to High",
        value: "priceLowToHigh",
        color: theme.colors.primary,
      },
      {
        id: "4",
        label: "Price high to low",
        value: "priceHighToLow",
        color: theme.colors.primary,
      },
    ],
    [],
  );
  return (
    <RadioGroup
      radioButtons={sortButtons}
      onPress={onPress}
      selectedId={selectedId}
      labelStyle={{ color: theme.colors.text }}
      containerStyle={{ alignItems: "flex-start" }}
    />
  );
}
