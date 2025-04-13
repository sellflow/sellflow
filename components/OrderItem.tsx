import { Colors } from "@/constants/Colors";
import { getOptimizedImageUrl } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { StyleSheet, Text, useColorScheme, View } from "react-native";

const imageSize = 75;
const blurHash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function OrderItem({ item }: { item: any }) {
  const colorScheme = useColorScheme();

  const textColor =
    colorScheme === "light" ? Colors.light.text : Colors.dark.text;

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
        {item.node.fulfillments.edges[0].node.fulfillmentLineItems.edges[0].node
          .lineItem.image.url && (
          <Image
            source={{
              uri: getOptimizedImageUrl(
                item.node.fulfillments.edges[0].node.fulfillmentLineItems
                  .edges[0].node.lineItem.image.url,
                imageSize,
              ),
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
          <Text style={{ color: textColor }}>
            {item.node.fulfillments.edges[0].node.estimatedDeliveryAt
              ? item.node.fulfillments.edges[0].node.estimatedDeliveryAt
              : item.node.fulfillments.edges[0].node.latestShipmentStatus}
          </Text>
          <Text style={{ color: textColor }}>
            {
              item.node.fulfillments.edges[0].node.fulfillmentLineItems.edges[0]
                .node.lineItem.name
            }
          </Text>
        </View>
        <View style={styles.Icon}>
          <Ionicons name="arrow-forward-sharp" size={28} color={textColor} />
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
  Icon: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
  },
});
