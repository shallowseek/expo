how to use useSharedValue


ChatGPT said:
Great — let's now focus only on useSharedValue and how to use it step-by-step.

🧠 What is useSharedValue?
useSharedValue(initialValue) creates a special reactive variable that is accessible from both the JS thread and the UI thread.

You use it to store values that can change over time — especially for animations or gestures.

✅ Step-by-Step Usage of useSharedValue
1. Import it from Reanimated
ts
Copy
Edit
import { useSharedValue } from 'react-native-reanimated';
2. Create the Shared Value
ts
Copy
Edit
const opacity = useSharedValue(0); // Initial value = 0
You can use it like an object: opacity.value = ...

It doesn't trigger a React re-render

It works with animation functions like withTiming, withSpring, etc.

3. Update It
ts
Copy
Edit
opacity.value = withTiming(1, { duration: 1000 });
// Smoothly animate from 0 → 1 over 1 second
You can also set it instantly:

ts
Copy
Edit
opacity.value = 1;
4. React to It (usually with useAnimatedStyle)
ts
Copy
Edit
const animatedStyle = useAnimatedStyle(() => {
  return {
    opacity: opacity.value, // automatically updates when value changes
  };
});
5. Apply to an Animated View
tsx
Copy
Edit
<Animated.View style={[styles.box, animatedStyle]} />
📦 Full Working Example
tsx
Copy
Edit
import React, { useEffect } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

export default function App() {
  const opacity = useSharedValue(0); // 🔹 Create shared value

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value, // 🔹 Use it reactively
  }));

  const handleFadeIn = () => {
    opacity.value = withTiming(1, { duration: 500 }); // 🔹 Animate it
  };

  return (
    <View style={styles.container}>
      <Button title="Fade In" onPress={handleFadeIn} />
      <Animated.View style={[styles.box, animatedStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
  box: {
    width: 150, height: 150, backgroundColor: 'tomato', marginTop: 20,
  },
});
✅ Summary
Step	What to Do
1️⃣	Import useSharedValue
2️⃣	Create it: const x = useSharedValue(0)
3️⃣	Update it: x.value = withTiming(100)
4️⃣	React to changes: useAnimatedStyle(() => ({ ... }))
5️⃣	Apply to <Animated.View style={...} />

🧠 Key Rule:
Always access and modify shared values with .value

Let me know if you’d like a gesture example (PanGestureHandler) or multiple shared values working together!








You said:
  const opacity = useSharedValue(0); // 🔹 Create shared value

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value, // 🔹 Use it reactively
  }));

  const handleFadeIn = () => {
    opacity.value = withTiming(1, { duration: 500 }); // 🔹 Animate it
  };, how three are related


ChatGPT said:
Perfect — let's break this down step by step to show how useSharedValue, useAnimatedStyle, and withTiming are related and how they work together in a smooth animation.

🔁 Summary of All Three:
Piece	What It Does
useSharedValue(0)	Creates a reactive, animatable value
useAnimatedStyle()	Creates a style that automatically updates when the shared value changes
withTiming(1)	Animates the shared value to 1 over time

🔹 Full Example Recap
tsx
Copy
Edit
const opacity = useSharedValue(0);            // 1. Shared value (state, reactive)

const animatedStyle = useAnimatedStyle(() => ({ 
  opacity: opacity.value                      // 2. Watch the shared value
}));

const handleFadeIn = () => {
  opacity.value = withTiming(1, { duration: 500 }); // 3. Animate the shared value
};
🔍 How They Are Connected:
🔹 1. useSharedValue(0)
Creates a value stored in shared/native memory, accessible from:

The JS thread (e.g., inside handleFadeIn)

The UI thread (inside a worklet like useAnimatedStyle)

Think of it like a variable opacity.value that both sides can access safely.

🔹 2. withTiming(1, { duration: 500 })
This tells Reanimated:

"Please animate opacity.value from its current value to 1 over 500ms, on the UI thread."

✅ Reanimated handles this without blocking JS or requiring React re-renders.

🔹 3. useAnimatedStyle(...)
This watches the opacity.value. Every time opacity.value changes — whether instantly or gradually — the style returned from useAnimatedStyle is recomputed and applied directly on the UI.

So when opacity.value animates from 0 → 1:

useAnimatedStyle runs on each frame (every ~16ms)

It updates the opacity style on the Animated.View

Your component visually fades in without re-rendering

✅ Flow Diagram
txt
Copy
Edit
User presses button → handleFadeIn()
                   ↓
     opacity.value = withTiming(1)
                   ↓
    Reanimated runs animation on UI thread
                   ↓
  useAnimatedStyle sees opacity.value changing
                   ↓
 Animated.View updates smoothly on screen
🎯 In One Sentence:
useSharedValue holds the animated value, withTiming changes that value over time, and useAnimatedStyle listens to the value and updates the view style accordingly — all smoothly and natively.

Let me know if you'd like to see the same logic applied to translateX or scale with gestures!









