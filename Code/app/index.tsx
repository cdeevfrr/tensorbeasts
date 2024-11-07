import { addCustomBeastToBox, createBox } from "@/Game/createStartup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "expo-router";
import { useState } from "react";
import { Text, View, StyleSheet, Button, Pressable } from "react-native";
import Collapsible from 'react-native-collapsible';


export default function Index() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <View
      style={styles.container}
    >
      <Text>Welcome!</Text>
      <Link href="/enterdungeon" style={styles.button}>
        Go to a dungeon
      </Link>
      <Link href="/beasts" style={styles.button}>
        Manage Beasts
      </Link>
      <Link href="/parties" style={styles.button}>
        Manage Parties
      </Link>
      <Pressable onPress={() => setIsCollapsed(!isCollapsed)}>
        <Text style={styles.button}>Developer options</Text>
      </Pressable>
      <Collapsible collapsed={isCollapsed}>
        <View style={styles.container}>
        <Button 
            title="Add custom beast to box"
            onPress={() => addCustomBeastToBox()}
        />
        <Button 
            title="Clear all storage (DANGEROUS!!! DELETES ALL BEASTS!)"
            onPress={async () => {
              await AsyncStorage.clear()
              await createBox()
            }}
        />
        </View>
      </Collapsible>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});
