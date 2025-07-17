import { View, Button, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function OpeningScreen() {
  const router = useRouter();

  return (
    


        <View style={styles.container}>
     <Text style={{ color: 'white' }}>Welcome!</Text>
      <Button title="Go to Screen A"  onPress={() => router.push('/screenA')}  />
      <Button title="Go to Screen B" onPress={() => router.push('/screenB')} />
      <Button title="Enter Tab View" onPress={() => router.push('/(tabs)')} />
    </View>
 
  
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:"black",
    borderColor:"pink",
    borderWidth:3,
   },
   buttons:{
    
   }
  
});
