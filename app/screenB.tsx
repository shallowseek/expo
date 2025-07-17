// app/screenB.tsx or wherever your screen is

import { View, Text, H1 } from 'dripsy';

export default function ScreenB() {
  return (
    <View
      sx={{
        backgroundColor: '$primary',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: '$3',
      }}
    >
      <H1 sx={{ color: '$text' }}>Welcome to Screen B</H1>
      <Text sx={{ marginTop: '$2', fontSize: 16 }}>
        Dripsy makes styling easier ✨
      </Text>
    </View>
  );
}
