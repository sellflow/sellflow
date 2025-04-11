import { Colors } from "@/constants/Colors";
import { Image } from "expo-image";
import { Link } from "expo-router";
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { useCart } from "./CartProvider";

const imageSize = 200;
const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function RecommendedProduct({ item }: { item: any }) {
  const colorScheme = useColorScheme();
  const { linesAdd } = useCart();
  const getImageUrl = (url: string) => {
    if (url) {
      const imageUrl = new URL(url);
      imageUrl.searchParams.append("height", String(imageSize));
      return imageUrl.toString();
    }
  };
  const addToCart = (e: GestureResponderEvent) => {
    e.stopPropagation();
    const merchandise = {
      merchandiseId: item.selectedOrFirstAvailableVariant!.id,
    };
    if (merchandise?.merchandiseId) {
      linesAdd([merchandise]);
    }
  };

  const textColor =
    colorScheme === "light" ? Colors.light.text : Colors.dark.text;

  return (
    <Link
      href={{
        pathname: "/(tabs)/product/[id]",
        params: { id: item.id },
      }}
      style={styles.container}
      key={item.id}
    >
      <TouchableOpacity>
        <Image
          //@ts-ignore
          source={{ uri: getImageUrl(item?.featuredImage?.url) }}
          placeholder={{ blurhash }}
          style={{
            width: imageSize,
            height: imageSize,
            ...styles.image,
          }}
        />
        <Text numberOfLines={1} style={[styles.heading, { color: textColor }]}>
          {item?.title}
        </Text>
        {item?.priceRange?.minVariantPrice && (
          <Text style={[styles.price, { color: textColor }]}>
            ${item.priceRange.minVariantPrice.amount}
          </Text>
        )}
        {item?.variantsCount?.count === 1 && (
          <TouchableOpacity
            style={styles.AddToCartButton}
            onPress={(e) => addToCart(e)}
          >
            <Text style={{ textAlign: "center", color: textColor }}>
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
    backgroundColor: "coral",
    paddingTop: 4,
    paddingBottom: 4,
    flex: 1,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: imageSize,
  },
  image: {
    backgroundColor: "white",
    borderRadius: 4,
  },
  heading: {
    flex: 1,
    marginTop: 8,
    color: "white",
    fontSize: 18,
    maxWidth: imageSize,
  },
  price: {
    color: "white",
    marginTop: 4,
    fontWeight: 600,
  },
});
