import { countBlocksDestroyed, DestroyEvent } from "@/Game/Dungeon/DestroyEvent";
import { View, Text, StyleSheet} from "react-native";

export function StackC({destroyEvents}: {destroyEvents: Array<DestroyEvent>}){
    return <View style={styles.stack}>
        {destroyEvents.map(dEvent => {
            return <Text>Destroyed {countBlocksDestroyed({destroyEvent: dEvent})} block(s)</Text>
        })}
    </View>
}

const styles = StyleSheet.create({
    stack: {
        flex: 1,
        margin: 20,
        backgroundColor: "white",
        borderRadius: 5,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
})