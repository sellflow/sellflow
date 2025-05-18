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
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { useMMKVString } from "react-native-mmkv";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Image } from "expo-image";
import { ProductProvider, useProduct, useShop } from "@shopify/hydrogen-react";
import { getDropdownProduct } from "@/shopify/product";
import { ClientResponse } from "@shopify/storefront-api-client";
import { useCart } from "./shopify/CartProvider";
import { getOptimizedImageUrl } from "@/lib/utils";
import { useLingui } from "@lingui/react/macro";
import { Link } from "expo-router";
import { UnistylesRuntime, withUnistyles } from "react-native-unistyles";
import { StyleSheet } from "react-native-unistyles";
import { darkTheme, lightTheme } from "@/styles/unistyles";

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
  const bottomSheetRef = useRef<BottomSheet>();
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

  return (
    <GestureHandlerRootView>
      <BottomSheetContext.Provider
        value={{ productId, setProductId, bottomSheet: bottomSheetRef }}
      >
        {children}
        <UniBottomSheet
          index={-1}
          snapPoints={["40%", "35%"]}
          ref={bottomSheetRef}
          onChange={getProductDropdown}
          enablePanDownToClose
        >
          <BottomSheetView style={styles.BottomSheetContainer}>
            {loading ? (
              <UniActivityIndicator />
            ) : (
              <ProductProvider data={product!.data!.product}>
                <Product bottomSheetRef={bottomSheetRef} />
              </ProductProvider>
            )}
          </BottomSheetView>
        </UniBottomSheet>
      </BottomSheetContext.Provider>
    </GestureHandlerRootView>
  );
}

const UniActivityIndicator = withUnistyles(ActivityIndicator, (theme) => ({
  color: theme.colors.text,
}));
const UniBottomSheet = withUnistyles(BottomSheet, (theme) => ({
  handleStyle: {
    backgroundColor: theme.colors.background,
  },
  handleIndicatorStyle: {
    backgroundColor: theme.colors.tabIconDefault,
  },
  backgroundStyle: {
    backgroundColor: theme.colors.background,
  },
}));

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
          <Text style={[styles.TitleText]}>{product?.title}</Text>
          <Link
            href={{
              pathname: "/product/[id]",
              params: { id: product?.id || "" },
            }}
            style={styles.Link}
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
                    <Text style={styles.Text}>{option?.name}</Text>
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
                                      ? UnistylesRuntime.colorScheme === "light"
                                        ? darkTheme.colors.text
                                        : lightTheme.colors.text
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
                                      ? UniStylesRuntime.colorScheme === "light"
                                        ? darkTheme.colors.text
                                        : lightTheme.colors.text
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
          <Text style={styles.PriceText}>
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
          <Text style={styles.AddToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheetView>
  );
}

const styles = StyleSheet.create((theme) => ({
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
    backgroundColor: theme.colors.background,
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
    color: theme.colors.tabIconDefault,
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
    color: theme.colors.text,
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
  Text: {
    color: theme.colors.text,
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
    color: theme.colors.text,
  },
  AddToCartButton: {
    marginTop: 16,
    borderRadius: 4,
    backgroundColor: "coral",
    paddingVertical: 8,
    maxWidth: "100%",
  },
  AddToCartText: {
    color: theme.colors.text,
    textAlign: "center",
  },
}));
