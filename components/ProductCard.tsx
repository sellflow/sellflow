import { Product as ShopifyProduct } from "@/types/storefront.types";
import { Image } from "expo-image";
import {
  Text,
  TouchableOpacity,
  GestureResponderEvent,
  Dimensions,
  View,
  Pressable,
} from "react-native";
import { useCart } from "./shopify/CartProvider";
import { getOptimizedImageUrl } from "@/lib/utils";
import { useLingui } from "@lingui/react/macro";
import { useProductBottomSheet } from "./BottomSheetProvider";
import { StyleSheet } from "react-native-unistyles";
import { useRouter } from "expo-router";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const imageSize = SCREEN_WIDTH > 640 ? 290 : SCREEN_WIDTH / 2 - 12;
const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function Product({ node }: { node: ShopifyProduct }) {
  const { i18n } = useLingui();
  const { linesAdd } = useCart();
  const { setProductId, bottomSheet } = useProductBottomSheet();
  const router = useRouter();

  const navigateToProduct = () => {
    router.push({
      pathname: "/product/[id]",
      params: { id: node.id },
    });
  };

  const addToCart = (e: GestureResponderEvent) => {
    e.stopPropagation();
    const merchandise = {
      merchandiseId: node.selectedOrFirstAvailableVariant!.id,
    };
    if (merchandise?.merchandiseId) {
      linesAdd([merchandise]);
    }
  };

  const handleMultiVariantAddToCart = (e: GestureResponderEvent) => {
    e.stopPropagation();
    setProductId(node.id);
    bottomSheet?.expand();
  };

  return (
    <View style={styles.container}>
      {/* Clickable product area */}
      <Pressable
        onPress={navigateToProduct}
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.7 : 1,
          },
          styles.productContent,
        ]}
      >
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
        <Text numberOfLines={1} style={styles.heading}>
          {node?.title}
        </Text>
        {node?.priceRange?.minVariantPrice && (
          <Text style={styles.price}>
            {i18n.number(node.priceRange.minVariantPrice.amount, {
              style: "currency",
              currency: node.priceRange.minVariantPrice.currencyCode,
            })}
          </Text>
        )}
      </Pressable>

      {/* Separate button area */}
      {node?.variantsCount!.count === 1 ? (
        <TouchableOpacity
          style={styles.AddToCartButton}
          onPress={addToCart}
          activeOpacity={0.7}
        >
          <Text style={styles.AddToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.AddToCartButton}
          onPress={handleMultiVariantAddToCart}
          activeOpacity={0.7}
        >
          <Text style={styles.AddToCartText}>Add to cart</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
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
  AddToCartText: {
    textAlign: "center",
    color: theme.colors.text,
  },
  container: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: "auto",
  },
  productContent: {
    width: "100%",
  },
  image: {
    backgroundColor: "white",
    borderRadius: 4,
  },
  heading: {
    flex: 1,
    marginTop: 8,
    fontSize: 20,
    maxWidth: imageSize,
    flexGrow: 0,
    color: theme.colors.text,
  },
  price: {
    marginTop: 4,
    fontWeight: 600,
    marginBottom: "auto",
    color: theme.colors.text,
  },
}));
