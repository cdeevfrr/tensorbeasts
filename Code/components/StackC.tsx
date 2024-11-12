import { countBlocksDestroyed, DestroyEvent } from "@/Game/Battle/DestroyEvent";
import { View, Text, StyleSheet} from "react-native";

export function StackC({destroyEvents}: {destroyEvents: Array<DestroyEvent>}){
    return <View style={styles.stack}>
        <View style={styles.header}>
            <Text>{destroyEvents.length} Block Destroy Events</Text>
        </View>
        { destroyEvents.length <= 30 &&
            destroyEvents.map((dEvent, index) => {
                return <Text key={index}>Destroyed {countBlocksDestroyed({destroyEvent: dEvent})} block(s)</Text>
            })
        }
    </View>
}

const styles = StyleSheet.create({
    stack: {
        flex: 1,
        margin: 20,
        backgroundColor: "white",
        borderRadius: 5,
        padding: 15,
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
    header: {
        backgroundColor: "#dddddd"
    }
})