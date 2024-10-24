import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="battle" options={{ title: 'Battle', headerShown: false }}/>
      <Stack.Screen name="dungeon" options={{ title: 'Dungeon' }}/>
      <Stack.Screen name="beasts" options={{ title: 'Beasts' }}/>
      <Stack.Screen name="parties" options={{ title: 'Parties' }}/>
    </Stack>
  );
}
