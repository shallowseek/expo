import React, { useState } from 'react';
import { View, Image, StyleSheet, Text, Pressable, Dimensions } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
// import GetPixelColor from 'react-native-get-pixel-color';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAG_SIZE = 100;
const ZOOM = 2;

export default function MagnifierColorPicker() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [hexColor, setHexColor] = useState<string>('#ffffff');

  const magnifierX = useSharedValue(SCREEN_WIDTH / 2);
  const magnifierY = useSharedValue(SCREEN_HEIGHT / 2);

const [pendingX, setPendingX] = useState(0);
const [pendingY, setPendingY] = useState(0);





  const selectImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (result.assets && result.assets[0].uri) {
      setImageUri(result.assets[0].uri);
    }
  };


  const updatePixelColor = async (x: number, y: number) => {
    // if (imageUri) {
    //   try {
    //     const color = await GetPixelColor.pickColorAt(imageUri, {
    //       x: Math.floor(x),
    //       y: Math.floor(y),
    //     });
    //     setHexColor(color);
    //   } catch (err) {
    //     console.warn('Failed to get pixel color', err);
    //   }
    // }
    console.log("this is the x and y",x,y)
  };


// This is sync — allowed in runOnJS
const handleMove = (x: number, y: number) => {
  setPendingX(x);
  setPendingY(y);
  updatePixelColor(x, y); // async call here is fine (from JS thread)
};



  const pan = Gesture.Pan()
    .onStart(e => {
       runOnJS(handleMove)(e.x, e.y);
//       Triggered when the user first touches the screen.

// e.x, e.y are the coordinates where the touch started.

// You're immediately calling updatePixelColor(e.x, e.y) to detect the pixel color under the finger at the initial touch point.
    })
    .onUpdate(e => {
      magnifierX.value = e.x;
      magnifierY.value = e.y;
      runOnJS(handleMove)(e.x, e.y);
// This tells Reanimated to run a JavaScript function from the UI thread.

// updatePixelColor() will likely read the pixel color from the image and set the hex code.



//    Triggered continuously as the user drags their finger.

// e.x, e.y are the updated finger positions.
    });



  const magnifierStyle = useAnimatedStyle(() => ({
    transform: [
      // transform is a special style property that tells React Native to move, rotate, scale, or skew a view.
      { translateX: magnifierX.value - MAG_SIZE / 2 },
      { translateY: magnifierY.value - MAG_SIZE / 2 },
    ],
  }));

  const zoomedImageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: -(magnifierX.value * ZOOM - MAG_SIZE / 2) },
      { translateY: -(magnifierY.value * ZOOM - MAG_SIZE / 2) },
      { scale: ZOOM },
    ],
  }));

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={selectImage}>
        <Text style={styles.buttonText}>Select Image</Text>
      </Pressable>

      {imageUri && (
        <GestureDetector gesture={pan}>
          <View style={styles.imageWrapper}>
            <Image source={{ uri: imageUri }} style={styles.image} />
            <Animated.View style={[styles.magnifier, magnifierStyle]}>
              <Animated.Image
                source={{ uri: imageUri }}
                style={[styles.zoomedImage, zoomedImageStyle]}
              />
              <View style={styles.border} />
            </Animated.View>
            <Text style={styles.hexCode}>{hexColor}</Text>
          </View>
        </GestureDetector>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center' },
  button: {
    marginTop: 50,
    backgroundColor: '#1abc9c',
    padding: 14,
    borderRadius: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  imageWrapper: { flex: 1, width: '100%', alignItems: 'center' },
  image: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT, resizeMode: 'contain' },
  magnifier: {
    position: 'absolute',
    width: MAG_SIZE,
    height: MAG_SIZE,
    borderRadius: MAG_SIZE / 2,
    overflow: 'hidden',
  },
  zoomedImage: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: 'contain',
  },
  border: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: MAG_SIZE / 2,
  },
  hexCode: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    color: '#fff',
    borderRadius: 8,
    fontSize: 16,
  },
});
