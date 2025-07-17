import { View, Text } from 'react-native'
import React from 'react'

export default async function captureImage(cameraRef) {
 
//capture image 

    if (cameraRef.current) {
      const photo = await cameraRef.current.takePhoto({
        flash: 'on',
        //returned photo is an  object//
      });
     
      console.log("this is the photo objet we got",photo)
      return photo
      // moveToGallery(photo.path)
      // { isMirrored: false,
      //                        │ path: '/data/user/0/com.privacy/cache/mrousavy8432853042043491865.jpg',
      //                        │ isRawPhoto: false,
      //                        │ height: 4080,
      //                        │ orientation: 'portrait',
      //                        └ width: 3060 }
    }
    
    
  };
