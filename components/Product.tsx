import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Pressable,
  useColorScheme,
} from "react-native";
import { useProduct } from "@shopify/hydrogen-react";
import { Link, UnknownOutputParams } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useCart } from "./CartProvider";
import ImageCarousel from "./ImageCarousel";
import { useLingui } from "@lingui/react/macro";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function Product({ search }: { search: UnknownOutputParams }) {
  const { i18n } = useLingui();
  const colorScheme = useColorScheme();
  const {
    product,
    options,
    selectedOptions,
    setSelectedOption,
    selectedVariant,
    isOptionInStock,
  } = useProduct();
  const { linesAdd } = useCart();

  const addToCart = () => {
    const merchandise = { merchandiseId: selectedVariant!.id };
    if (merchandise?.merchandiseId) {
      //@ts-ignore
      linesAdd([merchandise]);
    }
  };

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
                              style={[
                                styles.Option,
                                {
                                  backgroundColor:
                                    optionVal === selectedOptions![option.name!]
                                      ? colorScheme === "light"
                                        ? Colors.dark.background
                                        : Colors.light.background
                                      : backgroundColor,
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
    marginTop: 12,
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
