import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import { useProduct } from "@shopify/hydrogen-react";
import { Link, UnknownOutputParams } from "expo-router";
import { useCart } from "./shopify/CartProvider";
import ImageCarousel from "./ImageCarousel";
import { useLingui } from "@lingui/react/macro";
import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  UnistylesRuntime,
  useUnistyles,
} from "react-native-unistyles";
import Icon from "./Icon";
import { darkTheme, lightTheme } from "@/styles/unistyles";

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
  const { linesAdd } = useCart();
  const { theme } = useUnistyles();

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

  return (
    <View style={styles.Container}>
      <ImageCarousel images={product?.media?.edges} />
      <View style={styles.InfoContainer}>
        <Text style={styles.TitleText}>{product?.title}</Text>
        <>
          {options &&
            options.map(
              (option, index) =>
                options.length! > 1 && (
                  <View key={index} style={styles.OptionWrapper}>
                    <Text style={styles.OptionTitle}>{option?.name}</Text>
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
                            <Pressable
                              key={optionVal}
                              onPress={() =>
                                setSelectedOption(
                                  option.name || "",
                                  optionVal || "",
                                )
                              }
                              disabled={
                                !isOptionInStock(option.name || "", optionVal!)
                              }
                              style={[
                                styles.Option,
                                isOptionInStock(option.name || "", optionVal!)
                                  ? optionVal == selectedOptions![option.name!]
                                    ? UnistylesRuntime.colorScheme === "light"
                                      ? {
                                          backgroundColor:
                                            lightTheme.colors.text,
                                        }
                                      : {
                                          backgroundColor:
                                            darkTheme.colors.text,
                                        }
                                    : {}
                                  : { backgroundColor: "grey" },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.OptionVal,
                                  optionVal == selectedOptions![option.name!]
                                    ? UnistylesRuntime.colorScheme === "light"
                                      ? { color: darkTheme.colors.text }
                                      : { color: lightTheme.colors.text }
                                    : {},
                                ]}
                              >
                                {optionVal}
                              </Text>
                            </Pressable>
                          ))}
                    </ScrollView>
                  </View>
                ),
            )}
        </>
        {selectedVariant?.price?.amount && (
          <Text style={styles.PriceText}>
            {i18n.number(Number(selectedVariant.price.amount), {
              style: "currency",
              currency: selectedVariant.price.currencyCode,
            })}
          </Text>
        )}
        {
          <View style={styles.QuantitySelector}>
            <TouchableOpacity
              disabled={Number(quantity) - 1 === 0}
              onPress={() => setQuantity(String(Number(quantity) - 1))}
            >
              <Icon name="remove-sharp" size={16} />
            </TouchableOpacity>
            <TextInput
              keyboardType="number-pad"
              value={quantity}
              style={styles.QuantityInput}
              onChangeText={handleQuantityChange}
            />
            <TouchableOpacity
              disabled={
                Number(quantity) + 1 > (selectedVariant?.quantityAvailable || 0)
              }
              onPress={() => setQuantity(String(Number(quantity) + 1))}
            >
              <Icon name="add-sharp" size={16} />
            </TouchableOpacity>
          </View>
        }
        <TouchableOpacity
          style={styles.AddToCartButton}
          onPress={addToCart}
          disabled={!selectedVariant}
        >
          <Text style={styles.QuantityInput}>Add to Cart</Text>
        </TouchableOpacity>
        {selectedVariant?.id && (
          <TouchableOpacity style={styles.BuyNowButton}>
            <Text style={{ textAlign: "center", fontWeight: "600" }}>
              Buy now
            </Text>
          </TouchableOpacity>
        )}
        <Text style={[styles.Description]}>{product?.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  Container: {
    flexDirection: { xs: "column", md: "row" },
    gap: 32,
    width: "100%",
    maxWidth: { xs: UnistylesRuntime.screen.width, xl: 1175 },
  },
  InfoContainer: {
    width: { xs: "100%", md: "40%" },
    paddingHorizontal: { xs: 16, md: 640 },
  },
  TitleText: {
    fontSize: 40,
    fontWeight: "600",
    marginBottom: 16,
    color: theme.colors.text,
  },
  PriceText: {
    fontSize: 24,
    paddingVertical: 12,
    color: theme.colors.text,
  },
  OptionWrapper: {
    marginBottom: 8,
  },
  OptionTitle: {
    color: theme.colors.text,
  },
  Option: {
    backgroundColor: theme.colors.background,
    borderColor: "slategray",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    marginRight: 8,
  },
  OptionVal: {
    color: theme.colors.text,
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
    backgroundColors: theme.colors.border,
  },
  QuantityInput: {
    textAlign: "center",
    color: theme.colors.text,
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
    color: theme.colors.text,
  },
}));
