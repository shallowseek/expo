// app/_layout.tsx or app/layout.tsx
import { DripsyProvider, makeTheme } from 'dripsy';
import { Slot } from 'expo-router';

const theme = makeTheme({
  colors: {
    $text: 'white',
    $background: 'black',
    $primary: '#1e90ff',
  },
  space: {
    $0: 0,
    $1: 4,
    $2: 8,
    $3: 16,
    $4: 24,
    $5: 32,
  },
  // optionally add fonts, text variants, etc
});

export default function Layout() {
  return (
    <DripsyProvider theme={theme}>
      <Slot />
    </DripsyProvider>
  );
}
