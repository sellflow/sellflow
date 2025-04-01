import { getAccessToken } from "@/lib/tokens";
import { getUserInfo } from "@/shopify/user";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function Account() {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState<boolean>();
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
  return loading ? (
    <ActivityIndicator color="#fff" />
  ) : (
    <View style={styles.Container}>
      <Image style={styles.ProfilePicture} source={{ uri: user?.imageUrl }} />
      <View>
        <Text style={styles.UserInfoHeading}>First Name: </Text>
        <Text style={styles.UserInfo}>{user?.firstName}</Text>
      </View>
      <View>
        <Text style={styles.UserInfoHeading}>Last Name: </Text>
        <Text style={styles.UserInfo}>{user?.lastName}</Text>
      </View>
      <View>
        <Text style={styles.UserInfoHeading}>Phone Number: </Text>
        <Text style={styles.UserInfo}>{user?.phoneNumber?.phoneNumber}</Text>
      </View>
      <View>
        <Text style={styles.UserInfoHeading}>Email Address:</Text>
        <Text style={styles.UserInfo}>{user?.emailAddress?.emailAddress}</Text>
      </View>
      <View>
        <Text style={styles.UserInfoHeading}>Default Address: </Text>
        <Text style={styles?.UserInfo}>{user?.defaultAddress?.address1}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    color: "white",
    fontSize: 18,
    marginBottom: 4,
  },
  UserInfo: {
    color: "white",
    fontWeight: 600,
  },
});
