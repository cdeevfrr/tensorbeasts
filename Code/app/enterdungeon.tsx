import { PartyPlan } from "@/Game/Beasts/PartyPlan";
import { Link } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function EnterDungeon({
    parties
}: {
    parties: Array<PartyPlan>
}) {
    // TODO:
    // Check for a valid partyPlan, or say go back.
    // Let the player choose a partyPlan & a dungeon.
    // When they click "go", send them to the dungeon page!
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Enter Dungeon screen</Text>
        <Link 
            href={{
                pathname: "/dungeon",
                params: {
                    partyNumber: 1,
                    dungeonNumber: 1,
                } 
            }}
            style={styles.button}>
            Ready! Go to dungeon
        </Link>
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
    button: {
        fontSize: 20,
        textDecorationLine: 'underline',
        color: '#fff',
    },
});