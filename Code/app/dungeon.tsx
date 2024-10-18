import { View, Text, StyleSheet } from "react-native";

export default function Dungeon({
    dungeonState
}: {
    dungeonState: any
}) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>In Dungeon screen (not a battle)</Text>
      </View>
    );
  }

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
},
text: {
    color: '#fff',
},
});