import { Colors } from "@/constants/Colors";
import { getOptimizedImageUrl } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { useLingui } from "@lingui/react/macro";
import {
  mapSelectedProductOptionToObject,
  useCartLine,
} from "@shopify/hydrogen-react";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useCart } from "./shopify/CartProvider";

const imageSize = 100;
const blurHash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function LineItem() {
  const line = useCartLine();
  const { i18n } = useLingui();
  const { linesUpdate, linesRemove } = useCart();
  const colorScheme = useColorScheme();
  const [quantity, setQuantity] = useState(String(line.quantity));

  const textColor =
    colorScheme === "light" ? Colors.light.text : Colors.dark.text;

  const handleQuantityIncrease = () => {
    try {
      linesUpdate([
        {
          id: line.id!,
          merchandiseId: line!.merchandise!.id!,
          quantity: Number(quantity) + 1,
        },
      ]);
      setQuantity(String(Number(quantity) + 1));
    } catch (e) {
      console.error(`Error failed to increase line item quantity: ${e}`);
    }
  };
  const handleQuantityDecrease = () => {
    try {
      if (Number(quantity) - 1 === 0) {
        linesRemove([line.id!]);
      } else {
        linesUpdate([
          {
            id: line.id!,
            merchandiseId: line.merchandise!.id!,
            quantity: Number(quantity) - 1,
          },
        ]);
        setQuantity(String(Number(quantity) - 1));
      }
    } catch (e) {
      console.error(`Error failed to decrease line item quantity: ${e}`);
    }
  };

  const handleQuantityChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    if (numericValue === "" || numericValue === "0") {
      // Sets quantity to empty string so user doesn't have to "fight" with text input
      // to remove all numbers and then enter preferred quantity but doesn't update line
      setQuantity(numericValue);
      return;
    }
    linesUpdate([
      {
        id: line.id!,
        merchandiseId: line.merchandise!.id!,
        quantity: Number(numericValue),
      },
    ]);
    setQuantity(numericValue);
  };

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
        {line?.merchandise?.image?.url && (
          <Image
            source={{
              uri: getOptimizedImageUrl(line.merchandise.image.url, imageSize),
            }}
            placeholder={{ blurHash }}
            style={{
              width: imageSize,
              height: imageSize,
              ...styles.image,
            }}
          />
        )}
        <View style={styles.Labels}>
          <Text style={[styles.Title, { color: textColor }]} numberOfLines={1}>
            {line.merchandise?.product?.title}
          </Text>
          <Text style={{ color: textColor }}>{line.merchandise?.title}</Text>
          <Text style={[styles.Price, { color: textColor }]}>
            {i18n.number(Number(line.cost?.totalAmount?.amount), {
              style: "currency",
              currency: line.cost?.totalAmount?.currencyCode,
            })}
          </Text>
        </View>
        <View
          style={[
            styles.QuantitySelectorContainer,
            { backgroundColor: colorScheme === "light" ? "lightgrey" : "grey" },
          ]}
        >
          <View style={styles.QuantitySelector}>
            <TouchableOpacity
              onPress={handleQuantityDecrease}
              activeOpacity={0.7}
            >
              <Ionicons
                name={quantity === "1" ? "trash-bin-sharp" : "remove-sharp"}
                size={16}
                color={colorScheme === "light" ? "darkgrey" : "lightgrey"}
              />
            </TouchableOpacity>
            <TextInput
              value={quantity}
              keyboardType="number-pad"
              style={{ color: textColor, textAlign: "center" }}
              onChangeText={handleQuantityChange}
            />
            <TouchableOpacity
              onPress={handleQuantityIncrease}
              activeOpacity={0.7}
            >
              <Ionicons
                name="add-sharp"
                size={16}
                color={colorScheme === "light" ? "darkgrey" : "lightgrey"}
              />
            </TouchableOpacity>
          </View>
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
  QuantitySelectorContainer: {
    alignSelf: "flex-start",
    justifyContent: "center",
    borderRadius: 50,
  },
  Price: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginTop: "auto",
  },
  QuantitySelector: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 8,
  },
});
