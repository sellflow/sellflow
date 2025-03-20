import { Text, TouchableOpacity } from "react-native";

export default function ProductBuyNowButton() {
  return (
    <TouchableOpacity>
      <Text style={{ textAlign: "center", fontWeight: 600 }}>Buy now</Text>
    </TouchableOpacity>
  );
}
