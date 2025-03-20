import { Image } from "expo-image";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  BuyNowButton,
  mapSelectedProductOptionToObject,
  useCart,
  useProduct,
} from "@shopify/hydrogen-react";
import { Link, UnknownOutputParams } from "expo-router";
import { useEffect } from "react";
import { SelectedOptionInput } from "@shopify/hydrogen-react/storefront-api-types";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function Product({ search }: { search: UnknownOutputParams }) {
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
      linesAdd([merchandise]);
    }
  };

  return (
    <View>
      {product!.media!.edges!.map((media, index) => (
        <Image
          key={index}
          source={{
            uri: media!.node?.image.url,
          }}
          placeholder={{ blurhash }}
          style={{
            width: 300,
            height: 300,
          }}
        />
      ))}
      <Text style={{ color: "white", fontSize: 48, fontWeight: 600 }}>
        {product!.title}
      </Text>
      <>
        {options &&
          options.map(
            (option, index) =>
              options.length! > 1 && (
                <View key={option!.name}>
                  <Text style={{ color: "white" }}>{option!.name}</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      gap: 8,
                    }}
                  >
                    {option?.values &&
                      option.values
                        .sort((a, b) => a - b)
                        .map((optionVal) => (
                          <Link
                            onPress={() =>
                              setSelectedOption(option.name, optionVal)
                            }
                            style={[
                              styles.Option,
                              {
                                color:
                                  optionVal == selectedOptions[option.name]
                                    ? "red"
                                    : "white",
                              },
                            ]}
                            key={optionVal}
                            href={{
                              pathname: "/product/[handle]",
                              params: {
                                ...search,
                                handle: product!.handle,
                                [option?.name]: optionVal,
                              },
                            }}
                          >
                            {optionVal}
                          </Link>
                        ))}
                  </View>
                </View>
              ),
          )}
      </>
      {selectedVariant?.priceV2?.amount && (
        <Text style={{ color: "white", fontSize: 24 }}>
          ${selectedVariant.priceV2.amount}
        </Text>
      )}
      <TouchableOpacity
        style={styles.AddToCartButton}
        onPress={() => addToCart()}
        disabled={!selectedVariant}
      >
        <Text style={{ textAlign: "center", fontWeight: 600 }}>
          Add to Cart
        </Text>
      </TouchableOpacity>
      {selectedVariant?.id && (
        <BuyNowButton
          variantId={selectedVariant?.id}
          style={styles.BuyNowButton}
        >
          <Text style={{ textAlign: "center", fontWeight: 600 }}>Buy now</Text>
        </BuyNowButton>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  Option: {
    padding: 2,
    backgroundColor: "slategray",
    borderColor: "slategray",
    borderRadius: "100%",
    borderWidth: 1,
  },
  AddToCartButton: {
    marginTop: 16,
    borderRadius: 4,
    backgroundColor: "yellow",
    paddingTop: 4,
    paddingBottom: 4,
    flex: 1,
  },
  BuyNowButton: {
    marginTop: 8,
    borderRadius: 4,
    backgroundColor: "orange",
    paddingTop: 4,
    paddingBottom: 4,
    flex: 1,
  },
});
