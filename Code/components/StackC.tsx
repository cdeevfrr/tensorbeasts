import { countBlocksDestroyed, DestroyEvent } from "@/Game/Dungeon/DestroyEvent";
import { View, Text} from "react-native";

export function StackC({destroyEvents}: {destroyEvents: Array<DestroyEvent>}){
    return <View>
        {destroyEvents.map(dEvent => {
            return <Text>Destroyed {countBlocksDestroyed({destroyEvent: dEvent})} block(s)</Text>
        })}
    </View>
}