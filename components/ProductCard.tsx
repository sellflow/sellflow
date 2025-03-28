import { Product as ShopifyProduct } from "@/types/storefront.types";
import { useCart } from "@shopify/hydrogen-react";
import { Image } from "expo-image";
import { Link, router } from "expo-router";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
  View,
} from "react-native";

const imageSize = 300;
const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function Product({ item }: { item: { node: ShopifyProduct } }) {
  const { linesAdd } = useCart();
  const imageUrl = new URL(item?.node?.featuredImage?.url);
  imageUrl.searchParams.append("height", String(imageSize));

  const addToCart = (e: GestureResponderEvent) => {
    e.stopPropagation();
    const merchandise = {
      merchandiseId: item.node.selectedOrFirstAvailableVariant!.id,
    };
    if (merchandise?.merchandiseId) {
      linesAdd([merchandise]);
    }
  };

  return (
    <Link
      href={{
        pathname: "/(tabs)/product/[id]",
        params: { id: item.node.id },
      }}
      style={styles.container}
    >
      <TouchableOpacity key={item.node.id}>
        <Image
          //@ts-ignore
          source={{ uri: item.node?.featuredImage.url }}
          placeholder={{ blurhash }}
          style={{
            width: imageSize,
            height: imageSize,
            ...styles.image,
          }}
        />
        <Text numberOfLines={1} style={styles.heading}>
          {item.node?.title}
        </Text>
        {item?.node?.priceRange?.minVariantPrice && (
          <Text style={styles.price}>
            ${item.node.priceRange.minVariantPrice.amount}
          </Text>
        )}
        {item?.node?.variantsCount!.count === 1 && (
          <TouchableOpacity
            style={styles.AddToCartButton}
            onPress={(e) => addToCart(e)}
          >
            <Text style={{ textAlign: "center", fontWeight: 600 }}>
              Add to Cart
            </Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  AddToCartButton: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    borderRadius: 4,
    backgroundColor: "yellow",
    paddingTop: 4,
    paddingBottom: 4,
    flex: 1,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 16,
    paddingLeft: 16,
  },
  image: {
    backgroundColor: "white",
    borderRadius: 4,
  },
  heading: {
    flex: 1,
    marginTop: 8,
    color: "white",
    fontSize: 24,
    maxWidth: "100%",
  },
  price: {
    color: "white",
    marginTop: 4,
    fontWeight: 600,
  },
});
