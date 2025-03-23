import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { useState } from "react";

export default function Order() {
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState();

  return (
    <View>
      <Text style={{ color: "white" }}>Order {id}</Text>
    </View>
  );
}
