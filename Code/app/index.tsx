import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "expo-router";
import { Text, View, StyleSheet, Button } from "react-native";

export default function Index() {
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
      <Button 
        title="Clear all storage (DANGEROUS!!! DELETES ALL BEASTS!)"
        onPress={() => {
          AsyncStorage.clear()
        }}
      />
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
