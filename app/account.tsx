import { Colors } from "@/constants/Colors";
import { storage } from "@/lib/storage";
import { getUserInfo } from "@/shopify/user";
import { Trans } from "@lingui/react/macro";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { useMMKVString } from "react-native-mmkv";

export default function Account() {
  const [accessToken, setAccessToken] = useMMKVString("accessToken", storage);
  const colorScheme = useColorScheme();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["userAccount", accessToken],
    queryFn: async () => {
      if (accessToken) {
        const data = await getUserInfo(accessToken);
        const parsedData = await data.json();

        return parsedData.data.customer;
      }
    },
  });

  const textColor =
    colorScheme === "light" ? Colors.light.text : Colors.dark.text;
  const backgroundColor =
    colorScheme === "light" ? Colors.light.background : Colors.dark.background;

  return (
    <View style={[styles.PageContainer, { backgroundColor }]}>
      {isPending ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.Container}>
          <Image
            style={styles.ProfilePicture}
            source={{ uri: data?.imageUrl }}
          />
          <View>
            <Text style={[styles.UserInfoHeading, { color: textColor }]}>
              <Trans>First Name:</Trans>
            </Text>
            <Text style={[styles.UserInfo, { color: textColor }]}>
              {data?.firstName}
            </Text>
          </View>
          <View>
            <Text style={[styles.UserInfoHeading, { color: textColor }]}>
              <Trans>Last Name:</Trans>
            </Text>
            <Text style={[styles.UserInfo, { color: textColor }]}>
              {data?.lastName}
            </Text>
          </View>
          <View>
            <Text style={[styles.UserInfoHeading, { color: textColor }]}>
              <Trans>Phone Number:</Trans>
            </Text>
            <Text style={[styles.UserInfo, { color: textColor }]}>
              {data?.phoneNumber?.phoneNumber}
            </Text>
          </View>
          <View>
            <Text style={[styles.UserInfoHeading, { color: textColor }]}>
              <Trans>Email Address:</Trans>
            </Text>
            <Text style={[styles.UserInfo, { color: textColor }]}>
              {data?.emailAddress?.emailAddress}
            </Text>
          </View>
          <View>
            <Text style={[styles.UserInfoHeading, { color: textColor }]}>
              <Trans>Default Address: </Trans>
            </Text>
            <Text style={styles?.UserInfo}>
              {data?.defaultAddress?.address1}
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
    paddingHorizontal: 16,
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
