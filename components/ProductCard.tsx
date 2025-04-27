import { Colors } from "@/constants/Colors";
import { Product as ShopifyProduct } from "@/types/storefront.types";
import { Image } from "expo-image";
import { Link } from "expo-router";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
  Dimensions,
  useColorScheme,
  View,
} from "react-native";
import { useCart } from "./shopify/CartProvider";
import { getOptimizedImageUrl } from "@/lib/utils";
import { useLingui } from "@lingui/react/macro";
import { useProductBottomSheet } from "./BottomSheetProvider";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const imageSize = SCREEN_WIDTH > 640 ? 290 : SCREEN_WIDTH / 2 - 12;
const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function Product({ node }: { node: ShopifyProduct }) {
  const { i18n } = useLingui();
  const colorScheme = useColorScheme();
  const { linesAdd } = useCart();
  const { setProductId, bottomSheet } = useProductBottomSheet();

  const addToCart = (e: GestureResponderEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const merchandise = {
      merchandiseId: node.selectedOrFirstAvailableVariant!.id,
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
    <Link
      href={{
        pathname: "/product/[id]",
        params: { id: node.id },
      }}
      style={styles.container}
      asChild
    >
      <TouchableOpacity>
        <View>
          <Image
            //@ts-ignore
            source={{
              uri: getOptimizedImageUrl(node.featuredImage!.url, imageSize),
            }}
            placeholder={{ blurhash }}
            style={{
              width: imageSize,
              height: imageSize,
              ...styles.image,
            }}
          />
          <Text
            numberOfLines={1}
            style={[styles.heading, { color: textColor }]}
          >
            {node?.title}
          </Text>
          {node?.priceRange?.minVariantPrice && (
            <Text style={[styles.price, { color: textColor }]}>
              {i18n.number(node.priceRange.minVariantPrice.amount, {
                style: "currency",
                currency: node.priceRange.minVariantPrice.currencyCode,
              })}
            </Text>
          )}
          {node?.variantsCount!.count === 1 ? (
            <TouchableOpacity
              style={styles.AddToCartButton}
              onPress={(e) => addToCart(e)}
              activeOpacity={0.7}
            >
              <Text style={{ textAlign: "center", color: textColor }}>
                Add to Cart
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.AddToCartButton}
              onPress={(e) => handleMultiVariantAddToCart(e)}
              activeOpacity={0.7}
            >
              <Text style={{ textAlign: "center", color: textColor }}>
                Add to cart
              </Text>
            </TouchableOpacity>
          )}
        </View>
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
    borderRadius: 50,
    backgroundColor: "coral",
    paddingTop: 4,
    paddingBottom: 4,
  },
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: "auto",
  },
  image: {
    backgroundColor: "white",
    borderRadius: 4,
  },
  heading: {
    flex: 1,
    marginTop: 8,
    color: "white",
    fontSize: 20,
    maxWidth: imageSize,
    flexGrow: 0,
  },
  price: {
    color: "white",
    marginTop: 4,
    fontWeight: 600,
    marginBottom: "auto",
  },
});
