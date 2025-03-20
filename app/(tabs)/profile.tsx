import { Text, View, StyleSheet, Button, Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { getUser } from "@/shopify/user";
import { discovery, getAccessToken, getRefreshToken } from "@/lib/tokens";
import { loginUser, refreshUser } from "@/lib/auth";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link } from "expo-router";

WebBrowser.maybeCompleteAuthSession();
const blurHash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function Index() {
  const redirectUri = makeRedirectUri({ scheme: "https://" });
  const [loginComplete, setLoginComplete] = useState(false);
  const [user, setUser] = useState();

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_CUSTOMER_ACCOUNT_API_TOKEN!,
      scopes: ["openid", "email", "customer-account-api:full"],
      redirectUri,
    },
    discovery,
  );

  useEffect(() => {
    if (Platform.OS === "android" && !user) {
      WebBrowser.warmUpAsync();

      return () => {
        WebBrowser.coolDownAsync();
      };
    }
  }, [response]);

  useEffect(() => {
    getAccessToken().then((accessToken) => {
      if (accessToken) {
        getUser(accessToken).then(async (data) => {
          if (data.status === 200) {
            const parsedData = await data.json();
            setUser(await parsedData?.data.customer);
          } else if (data.status === 401) {
            getRefreshToken().then(async (refreshToken) => {
              if (refreshToken) {
                await refreshUser({ discovery });
              }
            });
          }
        });
      }
    });
  }, [loginComplete]);

  return user ? (
    <View style={styles.Container}>
      {user?.imageUrl ? (
        <Image
          source={{ uri: user?.imageUrl }}
          placeholder={{ blurHash }}
          style={{
            width: 64,
            height: 64,
            borderRadius: 100,
          }}
        />
      ) : (
        <Ionicons size={64} name="person-circle" color="white" />
      )}
      <Text style={styles.Username}>{user?.displayName}</Text>
      <View style={styles.OptionsContainer}>
        <Link style={styles.OptionButton} href="/orders">
          Orders
        </Link>
        <Link style={styles.OptionButton} href="/">
          Account
        </Link>
        <Link style={styles.OptionButton} href="/">
          Wishlist
        </Link>
        <Link style={styles.OptionButton} href="/">
          Settings
        </Link>
      </View>
    </View>
  ) : (
    <View style={styles.Container}>
      <Text style={styles.text}>Profile page</Text>
      <Button
        disabled={!request}
        title="Login"
        onPress={() => {
          loginUser({
            request,
            promptAsync,
            redirectUri,
            discovery,
            setLoginComplete,
          });
        }}
      />
      <Button
        title="Refresh"
        onPress={async () => await refreshUser({ discovery })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  OptionButton: {
    color: "black",
    width: "47.5%",
    paddingTop: 8,
    paddingBottom: 8,
    textAlign: "center",
    backgroundColor: "lightgrey",
    borderWidth: 2,
    borderColor: "grey",
    borderRadius: 50,
  },
  OptionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 8,
    paddingTop: 8,
  },
  Username: {
    color: "#fff",
    marginTop: 8,
  },
});
