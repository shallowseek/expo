import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { Camera, useCameraDevice, useCameraPermission, useFrameProcessor, useSkiaFrameProcessor } from 'react-native-vision-camera';
import { PaintStyle, Skia } from '@shopify/react-native-skia';
import { rgbaColor } from 'react-native-reanimated/lib/typescript/Colors';
import { runAtTargetFps } from 'react-native-vision-camera';
import { useResizePlugin } from 'vision-camera-resize-plugin';


const index = () => {
   const { hasPermission, requestPermission } = useCameraPermission();
   const [isCameraOn,setCameraOn] = useState(false)
const device = useCameraDevice('back')
 const cameraRef = useRef<Camera>(null);// this stays consistent across re-renders
  // useRef is a hook that gives you a container (called a "ref") that
  //  can store a value without causing a re-render when it changes.
  // "It's a special container that remembers a value between renders but 
  // changing it doesn’t cause a re-render."
  const [photoUri, setPhotoUri] = useState("");
  const [hexCode,setHexCode]=useState("")

    // const [torchOn, setTorchOn] = useState(true) // or false to turn off
const { resize } = useResizePlugin();
useEffect(() => {
 
  // (async () => {
  //   const status = await Camera.requestCameraPermission();
  //   console.log(`Camera permission status: ${status}`);
  // })();
  console.log("this is the state of permission",hasPermission)
  if(hasPermission === false){
    requestPermission()
    console.log("permission was nit granted and hence requested for it",hasPermission)
  }

  else{
    setCameraOn(true)
    if(device){
       console.log("Device formats:", device.formats);
    console.log("Device pixel formats:", device.formats.map(f => f.pixelFormat));
      console.log("this is the device we got from hook",device)
    }
  }
 
}, [hasPermission]);



//capture image 
  const captureImage = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePhoto({
        flash: 'on',
        //returned photo is an  object//
      });
      setPhotoUri(`file://${photo.path}`);
      console.log("this is the photo objet we got",photo)
      // moveToGallery(photo.path)
      // { isMirrored: false,
      //                        │ path: '/data/user/0/com.privacy/cache/mrousavy8432853042043491865.jpg',
      //                        │ isRawPhoto: false,
      //                        │ height: 4080,
      //                        │ orientation: 'portrait',
      //                        └ width: 3060 }
    }
    setCameraOn(false)
  };



const frameProcessor = useSkiaFrameProcessor((frame) => {
  'worklet';

  const originalWidth = frame.width;
  const originalHeight = frame.height;
  const pixelFormat = frame.pixelFormat;

  // Resize frame down for faster processing
  const resizedWidth = 192;
  const resizedHeight = 192;

  const resized = resize(frame, {
    scale: { width: resizedWidth, height: resizedHeight },
    pixelFormat: 'rgb',
    dataType: 'uint8',
  });

  if (!resized || resized.length < 3) return;

  // Rectangle originally in full frame
  const rectWidth = 150;
  const rectHeight = 150;
  const centerX = Math.floor(originalWidth / 2);
  const centerY = Math.floor(originalHeight / 2);
  const rectLeft = centerX - rectWidth / 2;
  const rectTop = centerY - rectHeight / 2;

  // Scale factor to map original frame → resized frame
  const scaleX = resizedWidth / originalWidth;
  const scaleY = resizedHeight / originalHeight;

  // Scaled rectangle in resized image
  const scaledLeft = Math.floor(rectLeft * scaleX);
  const scaledTop = Math.floor(rectTop * scaleY);
  const scaledWidth = Math.floor(rectWidth * scaleX);
  const scaledHeight = Math.floor(rectHeight * scaleY);

  let totalR = 0, totalG = 0, totalB = 0, count = 0;

  for (let y = scaledTop; y < scaledTop + scaledHeight; y++) {
    for (let x = scaledLeft; x < scaledLeft + scaledWidth; x++) {
      const index = (y * resizedWidth + x) * 3;
      totalR += resized[index];
      totalG += resized[index + 1];
      totalB += resized[index + 2];
      count++;
    }
  }

  const avgR = Math.round(totalR / count);
  const avgG = Math.round(totalG / count);
  const avgB = Math.round(totalB / count);

  const hex = `#${avgR.toString(16).padStart(2, '0')}${avgG.toString(16).padStart(2, '0')}${avgB.toString(16).padStart(2, '0')}`;

  console.log(`🎯 Averaged RGB: R=${avgR}, G=${avgG}, B=${avgB}, HEX=${hex}`);

  // Draw the red rectangle and center dot (for UI)
  frame.render();
  const rect = Skia.XYWHRect(rectLeft, rectTop, rectWidth, rectHeight);
  const paint = Skia.Paint();
  paint.setStyle(PaintStyle.Stroke);
  paint.setColor(Skia.Color('red'));
  paint.setStrokeWidth(4);
  frame.drawRect(rect, paint);
  frame.drawCircle(centerX, centerY, 4, paint);
}, []);











  return (
    <>
         
      
        {isCameraOn ===true ? 
            (
            <>
            <SafeAreaView style={{flex:1}}>
                        <Camera
      style={StyleSheet.absoluteFill}
      device={device}
       frameProcessor={frameProcessor}  // ✅ this line is required
              // here frameprocesser will be automatically passed frame argument
      isActive={true}
       torch={'on'} // force enable flashlight
      resizeMode={"contain"}
      // pixelFormat="rgb" // 👈 Force RGB format, although less effiecient
      preview={true}
      // Preview = The live camera feed you see on screen.
      // That visible "live image" — the real-time stream from your camera sensor — is called the preview.
       ref={cameraRef}
        photo={true} // very important!
    />
   <Text style={{color:"red"}}>{hexCode}</Text>
    <Pressable style={styles.captureButton} onPress={captureImage}>
            <Text style={styles.buttonText}>Click Photo</Text>
          </Pressable>




            </SafeAreaView>
    

          </>
  
  )
      :
    (  
          <SafeAreaView style={{backgroundColor:"pink", flex:1}}>
          {/* // why we have to write flex in safeareaView */}
              <View style={styles.container}>
              <Text>index</Text>
            </View>
        </SafeAreaView> )  }
    
    </>
 
    
   
  
  )
}

export default index

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: { color: '#fff', marginBottom: 20 },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    marginTop: 20,
    borderRadius: 6,
  },
  captureButton: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: '#1abc9c',
    padding: 14,
      alignSelf: 'center',       // ✅ centers it horizontally inside its parent
    borderRadius: 50,
    marginLeft:10
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
  camera: {
    width: '100%',
    height: '100%',
  },
});


















// so now this code will solely focus on calculating correct color code of object which is inside rectangle and not outside of that box in original frame 


// ChatGPT said:
// Yes — ✅ Exactly.
// The updated code solely focuses on averaging the color of pixels inside the red rectangle as it appears in the original full-resolution frame, not outside of it.

// 🔍 How it ensures accuracy:
// Rectangle is defined in original frame coordinates.

// We downscale the full frame (for speed), and calculate where the rectangle would land in this resized version.

// The code samples and averages only those pixels that fall within that scaled-down version of the red rectangle.

// This gives you a color code representing only the object inside the red box — no influence from outside areas.

// ✅ In short:
// ✅ Goal	✅ Achieved?
// Focus only on pixels inside box	✔️ Yes
// Ignore outside region	✔️ Yes
// Account for scaling	✔️ Yes
// Accurate average RGB + HEX	✔️ Yes

// If you'd like, I can also help you draw a live color preview (e.g., show a swatch or HEX text) on-screen — just let me know!









