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
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useCart } from "./shopify/CartProvider";
import { StyleSheet } from "react-native-unistyles";
import Icon from "./Icon";

const imageSize = 100;
const blurHash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function LineItem() {
  const line = useCartLine();
  const { i18n } = useLingui();
  const { linesUpdate, linesRemove } = useCart();
  const [quantity, setQuantity] = useState(String(line.quantity));

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
            //@ts-ignore
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
          <Text style={styles.Text}>{line.merchandise?.title}</Text>
          <Text style={styles.Price}>
            {i18n.number(Number(line.cost?.totalAmount?.amount), {
              style: "currency",
              currency: line.cost?.totalAmount?.currencyCode,
            })}
          </Text>
        </View>
        <View style={styles.QuantitySelectorContainer}>
          <View style={styles.QuantitySelector}>
            <TouchableOpacity
              onPress={handleQuantityDecrease}
              activeOpacity={0.7}
            >
              <Icon
                name={quantity === "1" ? "trash-bin-sharp" : "remove-sharp"}
                size={16}
              />
            </TouchableOpacity>
            <TextInput
              value={quantity}
              keyboardType="number-pad"
              style={styles.TextInput}
              onChangeText={handleQuantityChange}
            />
            <TouchableOpacity
              onPress={handleQuantityIncrease}
              activeOpacity={0.7}
            >
              <Icon name="add-sharp" size={16} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Link>
  );
}

const styles = StyleSheet.create((theme) => ({
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
    color: theme.colors.text,
  },
  Text: {
    color: theme.colors.text,
  },
  QuantitySelectorContainer: {
    alignSelf: "flex-start",
    justifyContent: "center",
    borderRadius: 50,
    backgroundColor: theme.colors.tabIconDefault,
  },
  Price: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: "auto",
    color: theme.colors.text,
  },
  QuantitySelector: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 8,
  },
  TextInput: {
    color: theme.colors.text,
    textAlign: "center",
  },
}));
