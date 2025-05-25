import { Text, View, Platform, TouchableOpacity } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { getUser } from "@/shopify/user";
import { discovery, loginUser, refreshUser } from "@/lib/auth";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native";
import { Trans } from "@lingui/react/macro";
import { useMMKVString } from "react-native-mmkv";
import { storage } from "@/lib/storage";
import { useQuery } from "@tanstack/react-query";
import ProfileSkeleton from "@/components/ProfileSkeleton";
import { StyleSheet } from "react-native-unistyles";
import Icon from "@/components/Icon";

WebBrowser.maybeCompleteAuthSession();

export default function Index() {
  const [loginComplete, setLoginComplete] = useState(false);
  const [accessToken, setAccessToken] = useMMKVString("accessToken", storage);
  const [refreshToken, setRefreshToken] = useMMKVString(
    "refreshToken",
    storage,
  );

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
    //If tokens are absent the query is disabled and will not automatically run on mount
    enabled: !!accessToken && !!refreshToken,
    queryKey: ["user", accessToken, refreshToken, loginComplete],
    queryFn: async () => {
      const data = await getUser(accessToken!);
      if (data.status === 200) {
        const parsedData = await data.json();
        return parsedData.data.customer;
      } else if (data.status === 401) {
        if (refreshToken) {
          await refreshUser();
          const data = await getUser(accessToken!);
          if (data.status === 200) {
            const parsedData = await data.json();
            return parsedData.data.customer;
          }
        }
      }
    },
  });

  if (isPending && accessToken && refreshToken) {
    return (
      <SafeAreaView style={[styles.PageContainer]}>
        <View style={styles.Container}>
          <ProfileSkeleton />
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={[styles.PageContainer]}>
        <View style={styles.Container}>
          <Text style={{ textAlign: "center" }}>
            <Trans>An unexpected error has occurred: {error.message}</Trans>
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return data ? (
    <SafeAreaView style={[styles.PageContainer]}>
      <View style={styles.Container}>
        <Icon size={96} name="person-circle" style={{ alignSelf: "center" }} />
        <Text style={[styles.Username]}>{data?.displayName}</Text>
        <View style={styles.OptionsContainer}>
          <Link style={styles.OptionButton} href="/orders">
            <Trans>Orders</Trans>
          </Link>
          <Link style={styles.OptionButton} href="/account">
            <Trans>Account</Trans>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  ) : (
    <SafeAreaView style={[styles.PageContainer]}>
      <View style={styles.Container}>
        <Text style={[styles.Header]}>
          <Trans>Log in or Sign up</Trans>
        </Text>
        <TouchableOpacity
          disabled={!request}
          style={styles.LogInButton}
          onPress={() => {
            loginUser({
              request,
              promptAsync,
              redirectUri,
              setLoginComplete,
            });
          }}
        >
          <Text style={styles.LogInText}>
            <Trans>Log in</Trans>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!request}
          style={styles.LogInButton}
          onPress={() => {
            loginUser({
              request,
              promptAsync,
              redirectUri,
              setLoginComplete,
            });
          }}
        >
          <Text style={styles.LogInText}>
            <Trans>Sign up</Trans>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  PageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
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
    backgroundColor: theme.colors.text,
    color: theme.colors.background,
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
    color: theme.colors.text,
  },
  Header: {
    alignSelf: "center",
    fontSize: 18,
    paddingBottom: 24,
    color: theme.colors.text,
  },
  LogInButton: {
    width: "100%",
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 4,
    backgroundColor: theme.colors.text,
  },
  LogInText: {
    color: theme.colors.background,
  },
}));
