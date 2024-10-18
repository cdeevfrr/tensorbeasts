import { Beast } from "@/Game/Beasts/Beast";
import { View, StyleSheet } from "react-native"
import { BeastC } from "./BeastC";

export function BeastRowC({
    beasts,
    beastClickCallback,
}: {
    beasts: Array<Beast | null>
    beastClickCallback: (beast: Beast | null) => any,
}){
    return <View style={styles.container}>
        { beasts.map(beast => {
            return <BeastC beast={beast} beastClickCallback={beastClickCallback}/>
        })}
    </View>
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row', // Arrange children horizontally
      justifyContent: 'flex-start',
      alignItems: 'center', // Center vertically
    }
  });