import { Image } from "expo-image";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

const imageSize = 75;
const blurHash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function OrderItem({ item }: { item: any }) {
  console.log(item);
  const url = new URL(
    item.node.fulfillments.edges[0].node.fulfillmentLineItems.edges[0].node.lineItem.image.url,
  );
  url.searchParams.append("height", String(imageSize));
  const imageUrl = url.toString();
  return (
    <>
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
        <Link
          href={
            item.node.fulfillments.edges[0].node.trackingInformation[0]?.url
          }
          style={{ color: "white", textDecorationLine: "underline" }}
        >
          {item.node.fulfillments.edges[0].node.trackingInformation[0]?.number}
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  Image: {
    backgroundColor: "white",
    borderRadius: 4,
  },
});
