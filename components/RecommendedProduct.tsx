import { Colors } from "@/constants/Colors";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { useCart } from "./shopify/CartProvider";
import { getOptimizedImageUrl } from "@/lib/utils";
import { useLingui } from "@lingui/react/macro";
import { useProductBottomSheet } from "./BottomSheetProvider";

const imageSize = 200;
const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function RecommendedProduct({ item }: { item: any }) {
  const { i18n } = useLingui();
  const colorScheme = useColorScheme();
  const { linesAdd } = useCart();
  const { setProductId, bottomSheet } = useProductBottomSheet();

  const navigateToProduct = () => {
    router.push({
      pathname: "/product/[id]",
      params: { id: item.id },
    });
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

  const handleMultiVariantAddToCart = (e: GestureResponderEvent) => {
    e.stopPropagation();
    e.preventDefault();

    setProductId(node.id);
    bottomSheet?.expand();
  };

  const textColor =
    colorScheme === "light" ? Colors.light.text : Colors.dark.text;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={navigateToProduct}
      activeOpacity={0.6}
    >
      <Image
        //@ts-ignore
        source={{
          uri: getOptimizedImageUrl(item?.featuredImage?.url, imageSize),
        }}
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
          {i18n.number(item.priceRange.minVariantPrice.amount, {
            style: "currency",
            currency: item.priceRange.minVariantPrice.currencyCode,
          })}
        </Text>
      )}
      {item?.variantsCount?.count === 1 ? (
        <TouchableOpacity
          style={styles.AddToCartButton}
          onPress={(e) => addToCart(e)}
        >
          <Text style={{ textAlign: "center", color: textColor }}>
            Add to Cart
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.AddToCartButton}
          onPress={(e) => handleMultiVariantAddToCart(e)}
        >
          <Text style={{ textAlign: "center", color: textColor }}>
            Add to Cart
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
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
    width: imageSize,
    alignItems: "flex-start",
    marginBottom: "auto",
  },
  image: {
    backgroundColor: "white",
    borderRadius: 4,
  },
  heading: {
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
