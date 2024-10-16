import { View, StyleSheet } from "react-native"
import { BeastStateC } from "./BeastStateC"
import { BeastState } from "@/Game/Dungeon/BeastState"

export function BeastRowC({
    beasts,
    beastClickCallback,
    minimize,
}: {
    beasts: Array<BeastState>
    beastClickCallback: (beast: BeastState) => any,
    minimize?: boolean,
}){
    return <View style={minimize? styles.containerMin : styles.container}>
        { beasts.map(beast => {
            return <BeastStateC beast={beast} beastClickCallback={beastClickCallback}/>
        })}
    </View>
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row', // Arrange children horizontally
      justifyContent: 'flex-start',
      alignItems: 'center', // Center vertically
    },
    containerMin: {
        flex: 1,
        flexDirection: 'row', // Arrange children horizontally
        justifyContent: 'flex-start',
        alignItems: 'center', // Center vertically
        maxHeight: '40%',
        maxWidth: '40%',
    },
  });