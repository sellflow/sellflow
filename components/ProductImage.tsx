import { getOptimizedImageUrl } from "@/lib/utils";
import { Image } from "expo-image";
import { View } from "react-native";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";
const imageSize =
  UnistylesRuntime.screen.width > 640 ? 640 : UnistylesRuntime.screen.width;

export default function ProductImage({ url }: { url: string }) {
  return (
    <View style={styles.Container} pointerEvents="none">
      <Image
        source={{
          uri: getOptimizedImageUrl(url, imageSize),
        }}
        placeholder={blurhash}
        style={styles.Image}
        contentFit="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    width: imageSize,
  },
  Image: {
    width: "100%",
    height: imageSize,
  },
});
