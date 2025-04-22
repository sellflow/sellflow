import { Colors } from "@/constants/Colors";
import { getAccessToken } from "@/lib/tokens";
import { getUserInfo } from "@/shopify/user";
import { Trans } from "@lingui/react/macro";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

export default function Account() {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState<boolean>();
  const colorScheme = useColorScheme();

  useEffect(() => {
    setLoading(true);
    getAccessToken().then((accessToken) => {
      if (accessToken) {
        getUserInfo(accessToken).then(async (res) => {
          const data = await res.json();
          setUser(await data.data.customer);
          setLoading(false);
          console.log(user);
        });
      }
    });
  }, []);

  const textColor =
    colorScheme === "light" ? Colors.light.text : Colors.dark.text;
  const backgroundColor =
    colorScheme === "light" ? Colors.light.background : Colors.dark.background;

  return (
    <View style={[styles.PageContainer, { backgroundColor }]}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.Container}>
          <Image
            style={styles.ProfilePicture}
            source={{ uri: user?.imageUrl }}
          />
          <View>
            <Text style={[styles.UserInfoHeading, { color: textColor }]}>
              <Trans>First Name:</Trans>
            </Text>
            <Text style={[styles.UserInfo, { color: textColor }]}>
              {user?.firstName}
            </Text>
          </View>
          <View>
            <Text style={[styles.UserInfoHeading, { color: textColor }]}>
              <Trans>Last Name:</Trans>
            </Text>
            <Text style={[styles.UserInfo, { color: textColor }]}>
              {user?.lastName}
            </Text>
          </View>
          <View>
            <Text style={[styles.UserInfoHeading, { color: textColor }]}>
              <Trans>Phone Number:</Trans>
            </Text>
            <Text style={[styles.UserInfo, { color: textColor }]}>
              {user?.phoneNumber?.phoneNumber}
            </Text>
          </View>
          <View>
            <Text style={[styles.UserInfoHeading, { color: textColor }]}>
              <Trans>Email Address:</Trans>
            </Text>
            <Text style={[styles.UserInfo, { color: textColor }]}>
              {user?.emailAddress?.emailAddress}
            </Text>
          </View>
          <View>
            <Text style={[styles.UserInfoHeading, { color: textColor }]}>
              <Trans>Default Address: </Trans>
            </Text>
            <Text style={styles?.UserInfo}>
              {user?.defaultAddress?.address1}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  PageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  Container: {
    maxWidth: 640,
    width: "100%",
    alignSelf: "center",
    gap: 24,
  },
  ProfilePicture: {
    alignSelf: "center",
    width: 100,
    height: 100,
  },
  UserInfoHeading: {
    fontSize: 18,
    marginBottom: 4,
  },
  UserInfo: {
    fontWeight: 600,
  },
});
