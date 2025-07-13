useAnimatedStyle, how do we use it


ChatGPT said:
Great — let’s dive into useAnimatedStyle, one of the core hooks in react-native-reanimated.

🧠 What is useAnimatedStyle?
useAnimatedStyle lets you define styles (like opacity, transform, color, etc.) that are animated using shared values.

It returns an animated style object that updates automatically when a shared value changes.

✅ Basic Example
🔹 Animated a box's opacity using useAnimatedStyle
tsx
Copy
Edit
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const FadeInBox = () => {
  const opacity = useSharedValue(0); // Shared value

  // Trigger animation on mount
  useEffect(() => {
    opacity.value = withTiming(1, { duration: 1000 });
  }, []);

  // Animated style depends on shared value
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value, // this is reactive!
    };
  });

  return (
    <Animated.View style={[styles.box, animatedStyle]} />
  );
};
🧩 How it Works:
useSharedValue(0) creates a shared value

useAnimatedStyle(() => ...) defines a worklet function that:

Reads the shared value

Returns a style object

Reanimated runs this function on the UI thread

Every time the shared value changes

It updates the native view’s style — no re-render needed

🧪 You Can Animate:
opacity

transform: [{ translateX }, { scale }]

width, height

backgroundColor (with interpolation)

borderRadius

etc.

🎯 Example: Move Box Horizontally
tsx
Copy
Edit
const x = useSharedValue(0);

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ translateX: x.value }],
}));

<Button title="Move Right" onPress={() => {
  x.value = withTiming(200); // animate to x = 200
}} />
<Animated.View style={[styles.box, animatedStyle]} />
🧠 Why is it Powerful?
Because:

It's declarative: you describe how the style reacts to values

It's efficient: animation runs on the UI thread

It's smooth: even if JS is busy, animations don't lag

It's reactive: as shared values change, styles update automatically

📌 Syntax Summary
tsx
Copy
Edit
const animatedStyle = useAnimatedStyle(() => ({
  // CSS-like styles that use shared values
  opacity: mySharedValue.value,
  transform: [{ scale: scale.value }],
}));
Then apply like:

tsx
Copy
Edit
<Animated.View style={animatedStyle} />
✅ TL;DR
Hook	What It Does
useAnimatedStyle	Returns a style object based on shared values that automatically updates as those values change
Used With	useSharedValue, withTiming, withSpring, gestures
Runs On	UI Thread (compiled as a worklet)
Does It Re-render?	❌ No React re-render is needed

Would you like an advanced example — like animating color, scale, or integrating with gestures (PanGestureHandler)?