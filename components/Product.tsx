import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Pressable,
  useColorScheme,
  TextInput,
} from "react-native";
import { useProduct } from "@shopify/hydrogen-react";
import { Link, UnknownOutputParams } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useCart } from "./shopify/CartProvider";
import ImageCarousel from "./ImageCarousel";
import { useLingui } from "@lingui/react/macro";
import { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function Product({ search }: { search: UnknownOutputParams }) {
  const { i18n } = useLingui();
  const {
    product,
    options,
    selectedOptions,
    setSelectedOption,
    selectedVariant,
    isOptionInStock,
  } = useProduct();
  // Keep track of current quantity to set max variant quantity to actualy value when user
  // changes product options
  const currentMaxQuantity = useRef(selectedVariant?.quantityAvailable || 1);
  const [quantity, setQuantity] = useState("1");
  const colorScheme = useColorScheme();
  const { linesAdd } = useCart();

  const addToCart = () => {
    const merchandise = {
      merchandiseId: selectedVariant!.id,
      quantity: Number(quantity),
    };
    if (merchandise?.merchandiseId) {
      //@ts-ignore
      linesAdd([merchandise]);
    }
  };

  const handleQuantityChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    if (numericValue === "" || numericValue === "0") {
      setQuantity("1");
      return;
    }
    setQuantity(
      (Number(numericValue) || 1) > (selectedVariant?.quantityAvailable || 1)
        ? String(selectedVariant?.quantityAvailable)
        : numericValue,
    );
  };

  useEffect(() => {
    if ((selectedVariant?.quantityAvailable || 0) < Number(quantity)) {
      setQuantity(String(selectedVariant?.quantityAvailable));
      currentMaxQuantity.current = selectedVariant?.quantityAvailable || 0;
    }
  }, [selectedVariant?.quantityAvailable]);

  const textColor =
    colorScheme === "light" ? Colors.light.text : Colors.dark.text;
  const backgroundColor =
    colorScheme === "light" ? Colors.light.background : Colors.dark.background;

  return (
    <View style={styles.Container}>
      <ImageCarousel images={product?.media?.edges} />
      <View style={styles.InfoContainer}>
        <Text style={[styles.TitleText, { color: textColor }]}>
          {product?.title}
        </Text>
        <>
          {options &&
            options.map(
              (option, index) =>
                options.length! > 1 && (
                  <View key={index} style={styles.OptionWrapper}>
                    <Text style={{ color: textColor }}>{option?.name}</Text>
                    <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      style={styles.OptionsScrollContainer}
                    >
                      {option?.values &&
                        option.values
                          //@ts-ignore
                          .sort((a, b) => a - b)
                          .map((optionVal) => (
                            <Link
                              key={optionVal}
                              href={{
                                pathname: "/product/[id]",
                                params: {
                                  ...search,
                                  id: product?.id || "",
                                  [option?.name || ""]: optionVal,
                                },
                              }}
                              disabled={
                                !isOptionInStock(option.name || "", optionVal!)
                              }
                              style={[
                                styles.Option,
                                {
                                  backgroundColor: isOptionInStock(
                                    option.name || "",
                                    optionVal!,
                                  )
                                    ? optionVal ===
                                      selectedOptions![option.name!]
                                      ? colorScheme === "light"
                                        ? Colors.dark.background
                                        : Colors.light.background
                                      : backgroundColor
                                    : "grey",
                                },
                              ]}
                              asChild
                            >
                              <Pressable
                                onPress={() =>
                                  setSelectedOption(
                                    option.name || "",
                                    optionVal || "",
                                  )
                                }
                              >
                                <Text
                                  style={{
                                    color:
                                      optionVal ==
                                      selectedOptions![option.name!]
                                        ? colorScheme === "light"
                                          ? Colors.dark.text
                                          : Colors.light.text
                                        : textColor,
                                  }}
                                >
                                  {optionVal}
                                </Text>
                              </Pressable>
                            </Link>
                          ))}
                    </ScrollView>
                  </View>
                ),
            )}
        </>
        {selectedVariant?.price?.amount && (
          <Text style={[styles.PriceText, { color: textColor }]}>
            {i18n.number(Number(selectedVariant.price.amount), {
              style: "currency",
              currency: selectedVariant.price.currencyCode,
            })}
          </Text>
        )}
        {
          <View
            style={[
              styles.QuantitySelector,
              {
                backgroundColor: colorScheme === "light" ? "lightgrey" : "grey",
              },
            ]}
          >
            <TouchableOpacity
              disabled={Number(quantity) - 1 === 0}
              onPress={() => setQuantity(String(Number(quantity) - 1))}
            >
              <Ionicons
                name="remove-sharp"
                size={16}
                color={colorScheme === "light" ? "darkgrey" : "lightgrey"}
              />
            </TouchableOpacity>
            <TextInput
              keyboardType="number-pad"
              value={quantity}
              style={{ color: textColor, textAlign: "center" }}
              onChangeText={handleQuantityChange}
            />
            <TouchableOpacity
              disabled={
                Number(quantity) + 1 > (selectedVariant?.quantityAvailable || 0)
              }
              onPress={() => setQuantity(String(Number(quantity) + 1))}
            >
              <Ionicons
                name="add-sharp"
                size={16}
                color={colorScheme === "light" ? "darkgrey" : "lightgrey"}
              />
            </TouchableOpacity>
          </View>
        }
        <TouchableOpacity
          style={styles.AddToCartButton}
          onPress={addToCart}
          disabled={!selectedVariant}
        >
          <Text style={{ color: textColor, textAlign: "center" }}>
            Add to Cart
          </Text>
        </TouchableOpacity>
        {selectedVariant?.id && (
          <TouchableOpacity style={styles.BuyNowButton}>
            <Text style={{ textAlign: "center", fontWeight: "600" }}>
              Buy now
            </Text>
          </TouchableOpacity>
        )}
        <Text style={[styles.Description, { color: textColor }]}>
          {product?.description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    flexDirection: SCREEN_WIDTH > 640 ? "row" : "column",
    gap: 32,
    width: "100%",
    maxWidth: SCREEN_WIDTH > 1175 ? 1175 : SCREEN_WIDTH,
  },
  InfoContainer: {
    width: SCREEN_WIDTH > 640 ? "40%" : "100%",
    paddingHorizontal: SCREEN_WIDTH > 640 ? 0 : 16,
  },
  TitleText: {
    fontSize: 40,
    fontWeight: "600",
    marginBottom: 16,
  },
  PriceText: {
    fontSize: 24,
    paddingVertical: 12,
  },
  OptionWrapper: {
    marginBottom: 8,
  },
  Option: {
    borderColor: "slategray",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    marginRight: 8,
  },
  OptionsScrollContainer: {
    flexGrow: 0,
    flexDirection: "row",
    flexWrap: "nowrap",
    paddingVertical: 4,
  },
  QuantitySelector: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 50,
    padding: 8,
  },
  AddToCartButton: {
    marginTop: 16,
    borderRadius: 4,
    backgroundColor: "coral",
    paddingVertical: 8,
    maxWidth: "100%",
  },
  BuyNowButton: {
    marginTop: 8,
    borderRadius: 4,
    backgroundColor: "orange",
    paddingVertical: 8,
    maxWidth: "100%",
  },
  Description: {
    maxWidth: "100%",
    paddingTop: 24,
  },
});
