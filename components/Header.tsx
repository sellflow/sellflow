import { storage } from "@/lib/storage";
import { getOptimizedImageUrl } from "@/lib/utils";
import { getPredictiveSearchResults } from "@/shopify/search";
import { t } from "@lingui/core/macro";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  Keyboard,
  Text,
  ScrollView,
  SafeAreaView,
  Platform,
} from "react-native";
import { useMMKVString } from "react-native-mmkv";
import { StyleSheet, withUnistyles } from "react-native-unistyles";
import Icon from "./Icon";

export default function Header() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [searchError, setSearchError] = useState(false);
  const [searchResults, setSearchResults] = useState();
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const [accessToken, setAccessToken] = useMMKVString("accessToken", storage);
  const logoAnim = useRef(new Animated.Value(0)).current;
  const arrowAnim = useRef(new Animated.Value(-50)).current;
  const inputRef = useRef(null);
  const searchBarOpacity = useRef(new Animated.Value(0)).current;
  let searchTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  const getSearchResults = async () => {
    try {
      const results = await getPredictiveSearchResults(search, accessToken);
      if (results.errors) {
        setSearchError(true);
      }
      setSearchResults(results.data);
    } catch (e) {
      console.error(e);
      setSearchError(true);
    }
  };

  const searchProducts = (text: string) => {
    setSearch(text);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      if (text !== "") {
        getSearchResults();
      }
    }, 500);
  };

  const toggleSearch = () => {
    if (searchBarOpen) {
      // Close the search bar
      Animated.parallel([
        Animated.timing(logoAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(arrowAnim, {
          toValue: -50,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(searchBarOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setSearchBarOpen(false);
        setSearch("");
        Keyboard.dismiss();
      });
    } else {
      // Open the search bar
      setSearchBarOpen(true);
      Animated.parallel([
        Animated.timing(logoAnim, {
          toValue: 50, // Move logo completely out of view
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(arrowAnim, {
          toValue: 0, // Move arrow into position
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(searchBarOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Focus the input after animation completes
        if (inputRef.current) {
          inputRef.current?.focus();
        }
      });
    }
  };

  const handleSubmit = () => {
    setSearchBarOpen(false);
    router.push({ pathname: "/search/[query]", params: { query: search } });
  };

  return (
    <SafeAreaView style={styles.Container}>
      <View style={styles.Header}>
        <View style={styles.AnimationContainer}>
          <Animated.View
            style={[
              styles.iconContainer,
              {
                transform: [{ translateX: logoAnim }],
                opacity: searchBarOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [100, 0],
                }),
              },
            ]}
          >
            <Image
              source={require("@/images/favicon.svg")}
              style={styles.logo}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.iconContainer,
              styles.backArrowContainer,
              {
                transform: [{ translateX: arrowAnim }],
                opacity: searchBarOpacity,
              },
            ]}
          >
            <TouchableOpacity onPress={toggleSearch} style={styles.backButton}>
              <Icon size={24} name="arrow-back-sharp" />
            </TouchableOpacity>
          </Animated.View>
        </View>

        <Animated.View
          style={[
            styles.searchContainer,
            {
              opacity: searchBarOpacity,
              display: searchBarOpen ? "flex" : "none",
            },
          ]}
        >
          <UniTextInput
            onSubmitEditing={handleSubmit}
            ref={inputRef}
            style={styles.SearchInput}
            placeholder={t`Search...`}
            value={search}
            onChangeText={searchProducts}
            autoCapitalize="none"
            returnKeyType="search"
          />
        </Animated.View>

        <TouchableOpacity
          onPress={() =>
            searchBarOpen && search !== "" ? setSearch("") : toggleSearch()
          }
          accessibilityLabel="Press to open search bar"
        >
          <Icon
            name={
              searchBarOpen && search !== "" ? "close-sharp" : "search-sharp"
            }
            size={24}
          />
        </TouchableOpacity>
        {searchBarOpen && searchError && (
          <View style={styles.SearchResultsContainer}>
            <Text style={{ paddingVertical: 8, alignSelf: "center" }}>
              Oops, an error has occurred!
            </Text>
          </View>
        )}
        {searchResults && searchBarOpen && (
          <ScrollView style={styles.SearchResultsContainer}>
            {searchResults?.predictiveSearch?.products?.map(
              (result: any, index: number) => (
                <Link
                  style={[
                    styles.SearchResult,
                    {
                      borderTopWidth: index !== 0 ? 1 : 0,
                    },
                  ]}
                  href={{
                    pathname: "/product/[id]",
                    params: { id: result.id },
                  }}
                  key={index}
                  asChild
                >
                  <TouchableOpacity key={index}>
                    <Image
                      source={{
                        uri:
                          getOptimizedImageUrl(result.featuredImage?.url, 50) ||
                          "",
                      }}
                      alt={result.featuredImage?.altText}
                      style={styles.SearchResultImage}
                    />
                    <Text style={styles.SearchResultHeading}>
                      {result.title}
                    </Text>
                  </TouchableOpacity>
                </Link>
              ),
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const UniTextInput = withUnistyles(TextInput, (theme) => ({
  placeholderTextColor: theme.colors.tint,
}));

const styles = StyleSheet.create((theme) => ({
  Container: {
    width: "100%",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  Header: {
    gap: 8,
    paddingTop: Platform.OS === "android" ? 48 : 12,
    paddingBottom: 16,
    paddingHorizontal: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    maxWidth: 1200,
    position: "relative",
  },
  AnimationContainer: {
    width: 35,
    height: 35,
    position: "relative",
    overflow: "visible",
  },
  iconContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  backArrowContainer: {
    zIndex: 2,
  },
  logo: {
    width: 35,
    height: 35,
    borderRadius: 100,
  },
  backButton: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flex: 1,
  },
  SearchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    borderWidth: 0,
    paddingHorizontal: 8,
    paddingTop: Platform.OS === "android" ? 4 : 0,
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
  },
  SearchResultsContainer: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.tint,
    position: "absolute",
    borderWidth: 1,
    borderRadius: 4,
    top: 96,
    left: 8,
    width: "100%",
    maxWidth: 1200,
  },
  SearchResult: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    paddingVertical: 8,
    paddingLeft: 16,
    borderTopColor: theme.colors.tint,
  },
  SearchResultImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    backgroundColor: "white",
  },
  SearchResultHeading: {
    fontSize: 18,
    fontWeight: 600,
    color: theme.colors.text,
  },
}));
