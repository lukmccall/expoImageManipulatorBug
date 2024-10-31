import { View, Text, Image, Button } from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import React from "react";
import { Asset } from "expo-asset";

const landspace_2 = require("../assets/images/Landscape_2.jpg");
const landspace_5 = require("../assets/images/Landscape_5.jpg");
const landspace_7 = require("../assets/images/Landscape_7.jpg");

export default function App() {
  const [assets, setAssets] = React.useState<string[]>([]);

  React.useEffect(() => {
    (async () => {
      try {
        const images = [landspace_2, landspace_5, landspace_7];
        const result = await Promise.all(
          images.map((image) => Asset.fromModule(image).downloadAsync())
        );
        setAssets(result.map((image) => image.localUri || image.uri));
      } catch (error) {
        console.log({ error });
      }
    })();
  }, []);

  if (!assets.length) {
    return <Text>Loading...</Text>;
  }

  return <Manipulator assets={assets} />;
}

function Manipulator({ assets }: { assets: string[] }) {
  const [index, setIndex] = React.useState(0);
  const [image, setImage] = React.useState(assets[index]);

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={{ uri: image }}
        style={{ flex: 1, resizeMode: "contain" }}
      />
      <Button
        title="Reset"
        onPress={() => {
          setImage(assets[index]);
        }}
      />
      <Button
        title="Next"
        onPress={() => {
          const newIndex = (index + 1) % assets.length;
          setIndex(newIndex);
          setImage(assets[newIndex]);
        }}
      />
      <Button
        title="Manipulate"
        onPress={async () => {
          const result = await ImageManipulator.manipulateAsync(image, [
            {
              resize: {
                width: 300,
                height: 200,
              },
            },
          ]);
          setImage(result.uri);
        }}
      />
    </View>
  );
}
