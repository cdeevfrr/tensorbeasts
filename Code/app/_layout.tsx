import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="battle" options={{ title: 'Battle' }}/>
      <Stack.Screen name="beasts" options={{ title: 'Beasts' }}/>
    </Stack>
  );
}
