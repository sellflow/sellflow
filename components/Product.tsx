import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ScrollView,
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
    <View style={styles.Container}>
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
      <View style={styles.InfoContainer}>
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
                    <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
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
                    </ScrollView>
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
        <Text style={styles.Description}>{product!.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    flexDirection: SCREEN_WIDTH > 640 ? "row" : "column",
    gap: 64,
    width: "100%",
    maxWidth: SCREEN_WIDTH > 1175 ? 1175 : SCREEN_WIDTH,
  },
  InfoContainer: {
    width: SCREEN_WIDTH > 640 ? "40%" : "100%",
    paddingHorizontal: SCREEN_WIDTH > 640 ? 0 : 16,
  },
  Option: {
    padding: 2,
    borderColor: "slategray",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    marginRight: 4,
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
  Description: {
    color: "white",
    width: "100%",
    paddingTop: 24,
  },
});
