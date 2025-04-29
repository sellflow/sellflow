import {
  Text,
  View,
  StyleSheet,
  Platform,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { getUser } from "@/shopify/user";
import { discovery, loginUser, refreshUser } from "@/lib/auth";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native";
import { Trans } from "@lingui/react/macro";
import { useMMKVString } from "react-native-mmkv";
import { storage } from "@/lib/storage";
import { useQuery } from "@tanstack/react-query";
import ProfileSkeleton from "@/components/ProfileSkeleton";

WebBrowser.maybeCompleteAuthSession();

export default function Index() {
  const [loginComplete, setLoginComplete] = useState(false);
  const [accessToken, setAccessToken] = useMMKVString("accessToken", storage);
  const [refreshToken, setRefreshToken] = useMMKVString(
    "refreshToken",
    storage,
  );

  const colorScheme = useColorScheme();
  const redirectUri = makeRedirectUri({
    scheme:
      Platform.OS === "web"
        ? "https://"
        : process.env.EXPO_PUBLIC_CUSTOMER_ACCOUNT_SHOP_ID,
    path: "profile",
  });
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_CUSTOMER_ACCOUNT_API_TOKEN!,
      scopes: ["openid", "email", "customer-account-api:full"],
      redirectUri,
    },
    discovery,
  );

  useEffect(() => {
    if (Platform.OS === "android" && !accessToken) {
      WebBrowser.warmUpAsync();

      return () => {
        WebBrowser.coolDownAsync();
      };
    }
  }, [response]);

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["user", accessToken, refreshToken, loginComplete],
    queryFn: async () => {
      if (accessToken) {
        const data = await getUser(accessToken);
        if (data.status === 200) {
          const parsedData = await data.json();
          return parsedData.data.customer;
        } else if (data.status === 401) {
          if (refreshToken) {
            await refreshUser();
            const data = await getUser(accessToken);
            if (data.status === 200) {
              const parsedData = await data.json();
              return parsedData.data.customer;
            }
          }
        }
      }
    },
  });

  const textColor =
    colorScheme === "light" ? Colors.light.text : Colors.dark.text;
  const backgroundColor =
    colorScheme === "light" ? Colors.light.background : Colors.dark.background;

  const oppositeTextColor =
    colorScheme === "light" ? Colors.dark.text : Colors.light.text;
  const oppositeBackgroundColor =
    colorScheme === "light" ? Colors.dark.background : Colors.light.background;

  if (isPending) {
    return (
      <SafeAreaView style={[styles.PageContainer, { backgroundColor }]}>
        <View style={styles.Container}>
          <ProfileSkeleton />
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={[styles.PageContainer, { backgroundColor }]}>
        <View style={styles.Container}>
          <Text style={{ textAlign: "center" }}>
            <Trans>An unexpected error has occurred: {error.message}</Trans>
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return data ? (
    <SafeAreaView style={[styles.PageContainer, { backgroundColor }]}>
      <View style={styles.Container}>
        <Ionicons
          size={96}
          name="person-circle"
          color={textColor}
          style={{ alignSelf: "center" }}
        />
        <Text style={[styles.Username, { color: textColor }]}>
          {data?.displayName}
        </Text>
        <View style={styles.OptionsContainer}>
          <Link
            style={[
              styles.OptionButton,
              {
                backgroundColor: oppositeBackgroundColor,
                color: oppositeTextColor,
              },
            ]}
            href="/orders"
          >
            <Trans>Orders</Trans>
          </Link>
          <Link
            style={[
              styles.OptionButton,
              {
                backgroundColor: oppositeBackgroundColor,
                color: oppositeTextColor,
              },
            ]}
            href="/account"
          >
            <Trans>Account</Trans>
          </Link>
          <Link
            style={[
              styles.OptionButton,
              {
                backgroundColor: oppositeBackgroundColor,
                color: oppositeTextColor,
              },
            ]}
            href="/"
          >
            <Ionicons name="heart-outline" size={16} />
          </Link>
          <Link
            style={[
              styles.OptionButton,
              {
                backgroundColor: oppositeBackgroundColor,
                color: oppositeTextColor,
              },
            ]}
            href="/"
          >
            <Ionicons name="settings-sharp" size={16} />
          </Link>
        </View>
      </View>
    </SafeAreaView>
  ) : (
    <SafeAreaView style={[styles.PageContainer, { backgroundColor }]}>
      <View style={styles.Container}>
        <Text style={[styles.Header, { color: textColor }]}>
          <Trans>Log in or Sign up</Trans>
        </Text>
        <TouchableOpacity
          disabled={!request}
          style={[
            styles.LogInButton,
            { backgroundColor: oppositeBackgroundColor },
          ]}
          onPress={() => {
            loginUser({
              request,
              promptAsync,
              redirectUri,
              setLoginComplete,
            });
          }}
        >
          <Text style={{ color: oppositeTextColor }}>
            <Trans>Log in</Trans>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!request}
          style={[
            styles.LogInButton,
            { backgroundColor: oppositeBackgroundColor },
          ]}
          onPress={() => {
            loginUser({
              request,
              promptAsync,
              redirectUri,
              setLoginComplete,
            });
          }}
        >
          <Text style={{ color: oppositeTextColor }}>
            <Trans>Sign up</Trans>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  PageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  Container: {
    width: "100%",
    maxWidth: 640,
    paddingHorizontal: 16,
    gap: 16,
  },
  OptionButton: {
    width: "47.5%",
    paddingVertical: 8,
    textAlign: "center",
    borderRadius: 4,
  },
  OptionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 8,
    paddingTop: 8,
  },
  Username: {
    marginTop: 8,
    alignSelf: "center",
  },
  Header: {
    alignSelf: "center",
    fontSize: 18,
    paddingBottom: 24,
  },
  LogInButton: {
    width: "100%",
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 4,
  },
});
