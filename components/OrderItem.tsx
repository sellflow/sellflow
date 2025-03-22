import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

const imageSize = 75;
const blurHash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function OrderItem({ item }: { item: any }) {
  const url = new URL(
    item.node.fulfillments.edges[0].node.fulfillmentLineItems.edges[0].node.lineItem.image.url,
  );
  url.searchParams.append("height", String(imageSize));
  const imageUrl = url.toString();

  return (
    <Link
      href={{
        pathname: "/order/[id]",
        params: {
          id: item.node.id,
        },
      }}
      style={{ width: "100%" }}
    >
      <View style={{ flexDirection: "row", width: "100%" }}>
        {imageUrl && (
          <Image
            source={{
              uri: imageUrl,
            }}
            placeholder={{ blurHash }}
            style={{
              width: imageSize,
              height: imageSize,
              ...styles.Image,
            }}
          />
        )}
        <View style={{ paddingLeft: 8 }}>
          <Text style={{ color: "white" }}>
            {item.node.fulfillments.edges[0].node.estimatedDeliveryAt
              ? item.node.fulfillments.edges[0].node.estimatedDeliveryAt
              : item.node.fulfillments.edges[0].node.latestShipmentStatus}
          </Text>
          <Text style={{ color: "white" }}>
            {
              item.node.fulfillments.edges[0].node.fulfillmentLineItems.edges[0]
                .node.lineItem.name
            }
          </Text>
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginLeft: "auto",
          }}
        >
          <Ionicons name="arrow-forward-sharp" size={28} color="#fff" />
        </View>
      </View>
    </Link>
  );
}

const styles = StyleSheet.create({
  Image: {
    backgroundColor: "white",
    borderRadius: 4,
  },
});
