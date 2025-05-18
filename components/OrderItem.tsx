import { getOptimizedImageUrl } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { Trans, useLingui } from "@lingui/react/macro";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import Icon from "./Icon";
import { StyleSheet } from "react-native-unistyles";

const imageSize = 75;
const blurHash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function OrderItem({ item }: { item: any }) {
  const { i18n } = useLingui();

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
        {item?.node?.fulfillments?.edges[0]?.node?.fulfillmentLineItems
          ?.edges[0]?.node?.lineItem?.image?.url && (
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
          <Text style={styles.Text}>
            <Trans>
              {item?.node?.fulfillments?.edges[0]?.node?.estimatedDeliveryAt
                ? i18n.date(
                    item.node.fulfillments.edges[0].node.estimatedDeliveryAt,
                  )
                : item?.node?.fulfillments?.edges[0]?.node
                    ?.latestShipmentStatus}
            </Trans>
          </Text>
          <Text style={styles.Text}>
            {
              item?.node?.fulfillments?.edges[0]?.node?.fulfillmentLineItems
                ?.edges[0]?.node?.lineItem?.name
            }
          </Text>
        </View>
        <View style={styles.Icon}>
          <Icon name="arrow-forward-sharp" size={28} />
        </View>
      </View>
    </Link>
  );
}

const styles = StyleSheet.create((theme) => ({
  Image: {
    backgroundColor: "white",
    borderRadius: 4,
  },
  Icon: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
  },
  Text: {
    color: theme.colors.text,
  },
}));
