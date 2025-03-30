import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import { BuyNowButton, useCart, useProduct } from "@shopify/hydrogen-react";
import { Link, UnknownOutputParams } from "expo-router";
import { useRef } from "react";
import ProductImage from "./ProductImage";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

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
  const flatListRef = useRef(null);

  const addToCart = () => {
    const merchandise = { merchandiseId: selectedVariant!.id };
    if (merchandise?.merchandiseId) {
      linesAdd([merchandise]);
    }
  };

  const getImageUrl = (url: string) => {
    if (url) {
      const imageURL = new URL(url);
      imageURL.searchParams.append(
        "height",
        String(SCREEN_WIDTH > 640 ? 640 : SCREEN_WIDTH),
      );
      return imageURL.toString();
    }
    return "";
  };

  return (
    <View
      style={{
        flexDirection: SCREEN_WIDTH > 640 ? "row" : "column",
        gap: 64,
      }}
    >
      <FlatList
        ref={flatListRef}
        data={product!.media!.edges}
        renderItem={({ item }) => (
          <ProductImage url={getImageUrl(item!.node?.image?.url)} />
        )}
        keyExtractor={(item) => item.node.image.url}
        showsHorizontalScrollIndicator={false}
        snapToInterval={SCREEN_WIDTH > 640 ? 640 : SCREEN_WIDTH}
        decelerationRate={"fast"}
        contentContainerStyle={{
          width: SCREEN_WIDTH > 640 ? 640 : SCREEN_WIDTH,
        }}
        horizontal
        pagingEnabled
      />
      <View>
        <Text style={{ color: "white", fontSize: 48, fontWeight: 600 }}>
          {product!.title}
        </Text>
        <>
          {options &&
            options.map(
              (option, index) =>
                options.length! > 1 && (
                  <View key={index}>
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
                                  backgroundColor:
                                    optionVal == selectedOptions[option.name]
                                      ? "black"
                                      : "white",
                                  color:
                                    optionVal == selectedOptions[option.name]
                                      ? "white"
                                      : "black",
                                },
                              ]}
                              key={optionVal}
                              href={{
                                pathname: "/product/[id]",
                                params: {
                                  ...search,
                                  id: product!.id!,
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
        {selectedVariant?.price?.amount && (
          <Text style={{ color: "white", fontSize: 24 }}>
            ${selectedVariant.price.amount}
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
            <Text style={{ textAlign: "center", fontWeight: 600 }}>
              Buy now
            </Text>
          </BuyNowButton>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Option: {
    padding: 2,
    borderColor: "slategray",
    paddingRight: 8,
    paddingLeft: 8,
    paddingBottom: 4,
    paddingTop: 4,
    borderRadius: 4,
    borderWidth: 1,
  },
  AddToCartButton: {
    marginTop: 16,
    borderRadius: 4,
    backgroundColor: "yellow",
    paddingTop: 4,
    paddingBottom: 4,
  },
  BuyNowButton: {
    marginTop: 8,
    borderRadius: 4,
    backgroundColor: "orange",
    paddingTop: 4,
    paddingBottom: 4,
  },
});
