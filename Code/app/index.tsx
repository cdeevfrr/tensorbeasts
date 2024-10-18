import { Link } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View
      style={styles.container}
    >
      <Text>Welcome!</Text>
      <Link href="/battle" style={styles.button}>
        Go to a Dungeon (currently starts a random battle - Dungeon coming soon!)
      </Link>
      <Link href="/beasts" style={styles.button}>
        Manage Beasts
      </Link>
      <Link href="/parties" style={styles.button}>
        Manage Parties
      </Link>
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
