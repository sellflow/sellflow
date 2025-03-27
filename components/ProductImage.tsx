import { Image } from "expo-image";
import { Dimensions, StyleSheet, View } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function ProductImage({ url }: { url: string }) {
  return (
    <View style={styles.Container} pointerEvents="none">
      <Image
        source={{ uri: url }}
        placeholder={blurhash}
        style={styles.Image}
        contentFit="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    width: SCREEN_WIDTH > 640 ? 640 : SCREEN_WIDTH,
  },
  Image: {
    width: "100%",
    height: SCREEN_WIDTH > 640 ? 640 : SCREEN_WIDTH,
  },
});
