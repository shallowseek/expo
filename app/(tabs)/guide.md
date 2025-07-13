==============================================
## React-NATIVE-REANIMATED ##############3
===============================================
# React Native Reanimated - Complete Guide

## Core Hooks

### 1. **useSharedValue**
Creates a value that can be shared between JS and Main threads.

```javascript
import { useSharedValue } from 'react-native-reanimated';

const MyComponent = () => {
  // Basic usage
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  // With initial values
  const progress = useSharedValue(0.5);
  const isVisible = useSharedValue(true);

  // Reading value (JS Thread)
  console.log(translateX.value); // 0

  // Setting value (triggers animation)
  translateX.value = 100;
  
  return <View />;
};
```

### 2. **useAnimatedStyle**
Creates animated styles that run on the Main Thread.

```javascript
import { useAnimatedStyle } from 'react-native-reanimated';

const MyComponent = () => {
  const translateX = useSharedValue(0);
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { rotate: `${rotation.value}deg` },
        { scale: translateX.value / 100 }
      ],
      opacity: translateX.value > 50 ? 0.5 : 1,
      backgroundColor: translateX.value > 100 ? 'red' : 'blue'
    };
  });

  return <Animated.View style={animatedStyle} />;
};
```

### 3. **useAnimatedGestureHandler**
Handles gestures on the Main Thread.

```javascript
import { useAnimatedGestureHandler } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

const DraggableBox = () => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (event, context) => {
      // Runs when gesture starts
      context.startX = translateX.value;
      context.startY = translateY.value;
    },
    
    onActive: (event, context) => {
      // Runs during gesture
      translateX.value = context.startX + event.translationX;
      translateY.value = context.startY + event.translationY;
    },
    
    onEnd: (event) => {
      // Runs when gesture ends
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    }
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value }
    ]
  }));

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={animatedStyle}>
        <View style={{ width: 100, height: 100, backgroundColor: 'blue' }} />
      </Animated.View>
    </PanGestureHandler>
  );
};
```

### 4. **useAnimatedReaction**
Reacts to shared value changes.

```javascript
import { useAnimatedReaction } from 'react-native-reanimated';

const MyComponent = () => {
  const progress = useSharedValue(0);
  const scale = useSharedValue(1);

  useAnimatedReaction(
    () => progress.value, // What to watch
    (current, previous) => {
      // What to do when it changes
      if (current > 0.5 && previous <= 0.5) {
        scale.value = withSpring(1.2);
      } else if (current <= 0.5 && previous > 0.5) {
        scale.value = withSpring(1);
      }
    },
    [progress.value] // Dependencies
  );

  return <View />;
};
```

### 5. **useAnimatedScrollHandler**
Handles scroll events on the Main Thread.

```javascript
import { useAnimatedScrollHandler } from 'react-native-reanimated';

const AnimatedScrollView = () => {
  const scrollY = useSharedValue(0);
  const headerOpacity = useSharedValue(1);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      headerOpacity.value = Math.max(0, 1 - scrollY.value / 100);
    },
    
    onBeginDrag: (event) => {
      console.log('Started dragging');
    },
    
    onEndDrag: (event) => {
      console.log('Stopped dragging');
    }
  });

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value
  }));

  return (
    <>
      <Animated.View style={[styles.header, headerStyle]} />
      <Animated.ScrollView onScroll={scrollHandler}>
        {/* Content */}
      </Animated.ScrollView>
    </>
  );
};
```

### 6. **useDerivedValue**
Creates a value derived from other shared values.

```javascript
import { useDerivedValue } from 'react-native-reanimated';

const MyComponent = () => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Derived value that updates automatically
  const distance = useDerivedValue(() => {
    return Math.sqrt(translateX.value ** 2 + translateY.value ** 2);
  });

  const isNearCenter = useDerivedValue(() => {
    return distance.value < 50;
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value }
    ],
    backgroundColor: isNearCenter.value ? 'green' : 'red'
  }));

  return <Animated.View style={animatedStyle} />;
};
```

### 7. **useWorkletCallback**
Creates a callback that runs on the Main Thread.

```javascript
import { useWorkletCallback } from 'react-native-reanimated';

const MyComponent = () => {
  const scale = useSharedValue(1);

  const handlePress = useWorkletCallback(() => {
    // This runs on Main Thread
    scale.value = withSequence(
      withTiming(1.2, { duration: 150 }),
      withTiming(1, { duration: 150 })
    );
  });

  return (
    <TouchableOpacity onPress={handlePress}>
      <Animated.View style={animatedStyle}>
        <Text>Press me</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};
```

## Animation Functions

### 1. **withTiming**
Linear timing animation.

```javascript
const animateToPosition = () => {
  translateX.value = withTiming(100, {
    duration: 1000,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1)
  });
};
```

### 2. **withSpring**
Spring-based animation.

```javascript
const bounceAnimation = () => {
  translateX.value = withSpring(100, {
    damping: 15,
    stiffness: 150,
    mass: 1,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001
  });
};
```

### 3. **withDelay**
Delays animation execution.

```javascript
const delayedAnimation = () => {
  opacity.value = withDelay(500, withTiming(0, { duration: 1000 }));
};
```

### 4. **withSequence**
Runs animations in sequence.

```javascript
const sequenceAnimation = () => {
  translateX.value = withSequence(
    withTiming(100, { duration: 500 }),
    withTiming(-100, { duration: 500 }),
    withTiming(0, { duration: 500 })
  );
};
```

### 5. **withRepeat**
Repeats animations.

```javascript
const repeatAnimation = () => {
  rotation.value = withRepeat(
    withTiming(360, { duration: 1000 }),
    -1, // Infinite repetition
    true // Reverse on each iteration
  );
};
```

### 6. **withDecay**
Decay animation (like momentum scrolling).

```javascript
const decayAnimation = (velocity) => {
  translateX.value = withDecay({
    velocity: velocity,
    clamp: [0, 300],
    deceleration: 0.998
  });
};
```

## Layout Animations

### 1. **Layout Transitions**
```javascript
import { Layout } from 'react-native-reanimated';

const AnimatedList = () => {
  const [items, setItems] = useState([1, 2, 3]);

  return (
    <View>
      {items.map(item => (
        <Animated.View
          key={item}
          layout={Layout.springify()}
          style={styles.item}
        />
      ))}
    </View>
  );
};
```

### 2. **Entering Animations**
```javascript
import { FadeIn, SlideInRight, ZoomIn } from 'react-native-reanimated';

const EnteringComponent = () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      {visible && (
        <Animated.View
          entering={FadeIn.duration(1000)}
          style={styles.box}
        />
      )}
      
      <Animated.View
        entering={SlideInRight.delay(300)}
        style={styles.box}
      />
      
      <Animated.View
        entering={ZoomIn.springify()}
        style={styles.box}
      />
    </>
  );
};
```

### 3. **Exiting Animations**
```javascript
import { FadeOut, SlideOutLeft, ZoomOut } from 'react-native-reanimated';

const ExitingComponent = () => {
  const [visible, setVisible] = useState(true);

  return (
    <>
      {visible && (
        <Animated.View
          exiting={FadeOut.duration(500)}
          style={styles.box}
        />
      )}
      
      <Animated.View
        exiting={SlideOutLeft.delay(200)}
        style={styles.box}
      />
      
      <Animated.View
        exiting={ZoomOut.springify()}
        style={styles.box}
      />
    </>
  );
};
```

## Utility Functions

### 1. **runOnJS**
Runs code on the JS Thread from Main Thread.

```javascript
import { runOnJS } from 'react-native-reanimated';

const MyComponent = () => {
  const [count, setCount] = useState(0);
  const translateX = useSharedValue(0);

  const updateCount = (newCount) => {
    setCount(newCount);
  };

  const gestureHandler = useAnimatedGestureHandler({
    onEnd: (event) => {
      // This runs on Main Thread
      translateX.value = withSpring(0);
      
      // Need to switch to JS Thread to update React state
      runOnJS(updateCount)(count + 1);
    }
  });

  return <View />;
};
```

### 2. **runOnUI**
Runs code on the Main Thread from JS Thread.

```javascript
import { runOnUI } from 'react-native-reanimated';

const MyComponent = () => {
  const scale = useSharedValue(1);

  const handlePress = () => {
    // This runs on JS Thread
    console.log('Button pressed');
    
    // Switch to Main Thread for animation
    runOnUI(() => {
      scale.value = withSpring(1.5);
    })();
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Animated.View style={animatedStyle} />
    </TouchableOpacity>
  );
};
```

### 3. **interpolate**
Maps input range to output range.

```javascript
import { interpolate } from 'react-native-reanimated';

const MyComponent = () => {
  const scrollY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 100, 200], // Input range
      [1, 0.5, 0],   // Output range
      'clamp'        // Extrapolation
    );

    const scale = interpolate(
      scrollY.value,
      [0, 100],
      [1, 0.8],
      'extend'
    );

    return {
      opacity,
      transform: [{ scale }]
    };
  });

  return <Animated.View style={animatedStyle} />;
};
```

### 4. **interpolateColor**
Interpolates between colors.

```javascript
import { interpolateColor } from 'react-native-reanimated';

const MyComponent = () => {
  const progress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 0.5, 1],
      ['red', 'yellow', 'green']
    );

    return { backgroundColor };
  });

  return <Animated.View style={animatedStyle} />;
};
```

## Components

### 1. **Animated.View**
```javascript
<Animated.View style={animatedStyle}>
  <Text>Animated content</Text>
</Animated.View>
```

### 2. **Animated.Text**
```javascript
<Animated.Text style={animatedTextStyle}>
  Animated text
</Animated.Text>
```

### 3. **Animated.Image**
```javascript
<Animated.Image
  source={{ uri: 'https://example.com/image.jpg' }}
  style={animatedImageStyle}
/>
```

### 4. **Animated.ScrollView**
```javascript
<Animated.ScrollView
  onScroll={scrollHandler}
  scrollEventThrottle={16}
>
  {/* Content */}
</Animated.ScrollView>
```

### 5. **Animated.FlatList**
```javascript
<Animated.FlatList
  data={data}
  renderItem={renderItem}
  onScroll={scrollHandler}
  scrollEventThrottle={16}
/>
```

## Advanced Examples

### Complex Animation System
```javascript
const ComplexAnimation = () => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  const progress = useDerivedValue(() => {
    return Math.sqrt(translateX.value ** 2 + translateY.value ** 2) / 100;
  });

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0, 1], [1, 0.3]);
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 0.5, 1],
      ['blue', 'purple', 'red']
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotation.value}deg` },
        { scale: scale.value }
      ],
      opacity,
      backgroundColor
    };
  });

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
      context.startY = translateY.value;
    },
    
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
      translateY.value = context.startY + event.translationY;
      rotation.value = event.rotation * 180 / Math.PI;
      scale.value = Math.max(0.5, Math.min(2, event.scale));
    },
    
    onEnd: () => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      rotation.value = withSpring(0);
      scale.value = withSpring(1);
    }
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={animatedStyle}>
        <View style={styles.box} />
      </Animated.View>
    </PanGestureHandler>
  );
};
```

## Best Practices

1. **Use `useSharedValue` for values that need to be animated**
2. **Use `useAnimatedStyle` for styles that change during animation**
3. **Use `useAnimatedGestureHandler` for gesture-driven animations**
4. **Use `runOnJS` sparingly - only when you need to update React state**
5. **Prefer Main Thread operations for smooth animations**
6. **Use `interpolate` for complex value transformations**
7. **Use layout animations for list changes**
8. **Always clean up animations in `useEffect` cleanup**

This covers all the major hooks, functions, and components in React Native Reanimated 2!