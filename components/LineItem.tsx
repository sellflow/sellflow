import {
  mapSelectedProductOptionToObject,
  useCartLine,
} from "@shopify/hydrogen-react";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

const imageSize = 100;
const blurHash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function LineItem() {
  const line = useCartLine();
  const imageUrl = line.merchandise?.image?.url
    ? new URL(line.merchandise?.image?.url!)
    : "";
  if (imageUrl) {
    imageUrl.searchParams.append("height", String(imageSize));
  }

  return (
    <Link
      href={{
        pathname: "/product/[id]",
        params: {
          id: line.merchandise!.product!.id!,
          ...mapSelectedProductOptionToObject(
            //@ts-ignore
            line.merchandise!.selectedOptions!,
          ),
        },
      }}
      style={styles.Container}
    >
      <View style={styles.ContentContainer}>
        {imageUrl && (
          <Image
            source={{ uri: imageUrl.toString() }}
            placeholder={{ blurHash }}
            style={{
              width: imageSize,
              height: imageSize,
              ...styles.image,
            }}
          />
        )}
        <View style={styles.Labels}>
          <Text style={styles.Title} numberOfLines={1}>
            {line.merchandise?.product?.title}
          </Text>
          <Text>{line.merchandise?.title}</Text>
          <Text style={{ marginTop: "auto" }}>Quantity: {line.quantity}</Text>
        </View>
        <View style={styles.PriceContainer}>
          <Text style={styles.Price}>${line.cost?.totalAmount?.amount}</Text>
        </View>
      </View>
    </Link>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: "white",
    borderRadius: 4,
  },
  ContentContainer: {
    width: "100%",
    flexDirection: "row",
  },
  Container: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  Labels: {
    marginLeft: 8,
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    color: "white",
  },
  Title: {
    fontSize: 20,
  },
  PriceContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  Price: {
    color: "white",
    fontWeight: "600",
    textAlign: "right",
  },
});
