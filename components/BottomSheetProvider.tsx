import {
  createContext,
  ReactNode,
  useCallback,
  useState,
  useContext,
  useRef,
  useEffect,
} from "react";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { storage } from "@/lib/storage";
import type { Dispatch, RefObject, SetStateAction } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useMMKVString } from "react-native-mmkv";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Colors } from "@/constants/Colors";
import { Image } from "expo-image";
import { ProductProvider, useProduct, useShop } from "@shopify/hydrogen-react";
import { getDropdownProduct } from "@/shopify/product";
import { ClientResponse } from "@shopify/storefront-api-client";
import { useCart } from "./shopify/CartProvider";
import { getOptimizedImageUrl } from "@/lib/utils";
import { ScrollView } from "react-native";
import { useLingui } from "@lingui/react/macro";
import { Link } from "expo-router";

interface BottomSheetContextProps {
  productId: string;
  setProductId: Dispatch<SetStateAction<string>>;
  bottomSheet: RefObject<BottomSheet>;
}

const BottomSheetContext = createContext<BottomSheetContextProps>({
  productId: "",
  setProductId: () => {},
  //@ts-ignore
  bottomSheet: null,
});

export const useProductBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error(
      "useProductBottomSheet must be used withtin BottomSheetProvider",
    );
  }

  return {
    productId: context.productId,
    setProductId: context.setProductId,
    bottomSheet: context.bottomSheet.current,
  };
};

export default function BottomSheetProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { countryIsoCode, languageIsoCode } = useShop();
  const colorScheme = useColorScheme();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [product, setProduct] = useState<ClientResponse<any>>();
  const [loading, setLoading] = useState(true);
  const [productId, setProductId] = useState("");
  const [accessToken, setAccessToken] = useMMKVString("accessToken", storage);

  const getProductDropdown = useCallback(
    async (index: number) => {
      if (
        index !== -1 &&
        product?.data?.product?.id !== productId &&
        productId
      ) {
        setLoading(true);
        try {
          const data = await getDropdownProduct(
            productId,
            countryIsoCode,
            languageIsoCode,
            accessToken,
          );
          if (data?.errors?.graphQLErrors) {
            //@ts-ignore
            throw new Error(data.errors.graphQLErrors);
          }

          setProduct(data);
          setLoading(false);
        } catch (e) {
          console.error(
            `An unexpected error has occurred fetching product: ${e}`,
          );
        }
      }
    },
    [productId, accessToken],
  );

  useEffect(() => {
    getProductDropdown(0);
  }, [getProductDropdown]);

  const textColor =
    colorScheme === "light" ? Colors.light.text : Colors.dark.text;
  const backgroundColor =
    colorScheme === "light" ? Colors.light.background : Colors.dark.background;

  return (
    <GestureHandlerRootView>
      <BottomSheetContext.Provider
        value={{ productId, setProductId, bottomSheet: bottomSheetRef }}
      >
        {children}
        <BottomSheet
          index={-1}
          snapPoints={["40%", "35%"]}
          ref={bottomSheetRef}
          onChange={getProductDropdown}
          handleStyle={{ backgroundColor }}
          handleIndicatorStyle={{
            backgroundColor: colorScheme === "light" ? "grey" : "lightgrey",
          }}
          backgroundStyle={{ backgroundColor }}
          enablePanDownToClose
        >
          <BottomSheetView
            style={[styles.BottomSheetContainer, { backgroundColor }]}
          >
            {loading ? (
              <ActivityIndicator color={textColor} />
            ) : (
              <ProductProvider data={product!.data!.product}>
                <Product bottomSheetRef={bottomSheetRef} />
              </ProductProvider>
            )}
          </BottomSheetView>
        </BottomSheet>
      </BottomSheetContext.Provider>
    </GestureHandlerRootView>
  );
}

function Product({
  bottomSheetRef,
}: {
  bottomSheetRef: RefObject<BottomSheet>;
}) {
  const { i18n } = useLingui();
  const {
    product,
    options,
    selectedOptions,
    setSelectedOption,
    selectedVariant,
    isOptionInStock,
  } = useProduct();
  const colorScheme = useColorScheme();
  const { linesAdd } = useCart();

  const addToCart = () => {
    const merchandise = {
      merchandiseId: selectedVariant!.id,
    };
    if (merchandise?.merchandiseId) {
      //@ts-ignore
      linesAdd([merchandise]);
    }
    bottomSheetRef?.current?.close();
  };

  const textColor =
    colorScheme === "light" ? Colors.light.text : Colors.dark.text;
  const backgroundColor =
    colorScheme === "light" ? Colors.light.background : Colors.dark.background;

  return (
    <BottomSheetView style={styles.ProductContainer}>
      <BottomSheetView style={styles.ProductDisplayContainer}>
        <Image
          source={{
            uri: getOptimizedImageUrl(product!.featuredImage!.url!, 75),
          }}
          style={styles.FeaturedImage}
        />
        <BottomSheetView style={styles.ProductLinkContainer}>
          <Text style={[styles.TitleText, { color: textColor }]}>
            {product?.title}
          </Text>
          <Link
            href={{
              pathname: "/product/[id]",
              params: { id: product?.id || "" },
            }}
            style={[
              styles.Link,
              {
                color: colorScheme === "light" ? "darkgrey" : "lightgrey",
              },
            ]}
            onPress={() => bottomSheetRef?.current?.close()}
          >
            See all item details
          </Link>
        </BottomSheetView>
      </BottomSheetView>

      <BottomSheetView style={styles.InfoContainer}>
        <>
          {options &&
            options.map(
              (option, index) =>
                options.length! > 1 && (
                  <BottomSheetView key={index} style={styles.OptionWrapper}>
                    <Text style={{ color: textColor }}>{option?.name}</Text>
                    <BottomSheetScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      style={styles.OptionsScrollContainer}
                    >
                      {option?.values &&
                        option.values
                          //@ts-ignore
                          .sort((a, b) => a - b)
                          .map((optionVal) => (
                            <TouchableOpacity
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
                              key={optionVal}
                            >
                              <Text
                                style={{
                                  color:
                                    optionVal == selectedOptions![option.name!]
                                      ? colorScheme === "light"
                                        ? Colors.dark.text
                                        : Colors.light.text
                                      : textColor,
                                }}
                              >
                                {optionVal}
                              </Text>
                            </TouchableOpacity>
                          ))}
                    </BottomSheetScrollView>
                  </BottomSheetView>
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
          testID="bottom_sheet_add_to_cart"
          style={styles.AddToCartButton}
          onPress={addToCart}
          disabled={!selectedVariant}
        >
          <Text style={{ color: textColor, textAlign: "center" }}>
            Add to Cart
          </Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheetView>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  ContentContainer: {
    flex: 1,
  },
  BottomSheetContainer: {
    flex: 1,
    paddingHorizontal: 8,
    paddingBottom: 36,
    alignItems: "center",
  },
  ProductContainer: {
    width: "100%",
    maxWidth: 640,
  },
  ProductDisplayContainer: {
    flexDirection: "row",
    paddingBottom: 16,
    gap: 8,
  },
  ProductLinkContainer: {
    gap: 4,
  },
  Link: {
    textDecorationLine: "underline",
  },
  ProductInfoContainer: {},
  FeaturedImage: {
    width: 75,
    height: 75,
    borderRadius: 4,
  },
  InfoContainer: {},
  TitleText: {
    fontWeight: 600,
  },
  OptionWrapper: {
    marginBottom: 8,
  },
  OptionsScrollContainer: {
    flexGrow: 0,
    flexDirection: "row",
    flexWrap: "nowrap",
    paddingVertical: 4,
  },
  Option: {
    borderColor: "slategray",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    marginRight: 8,
  },
  PriceText: {
    fontSize: 18,
    paddingTop: 32,
  },
  AddToCartButton: {
    marginTop: 16,
    borderRadius: 4,
    backgroundColor: "coral",
    paddingVertical: 8,
    maxWidth: "100%",
  },
});
