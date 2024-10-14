import { View, StyleSheet } from "react-native"
import { BeastStateC } from "./BeastStateC"

export function BeastRowC({
    beasts,
    beastClickCallback
}: {
    beasts: Array<BeastState>
    beastClickCallback: (beast: BeastState) => any
}){
    return <View style={styles.container}>
        { beasts.map(beast => {
            return <BeastStateC beast={beast} beastClickCallback={beastClickCallback}/>
        })}
    </View>
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row', // Arrange children horizontally
      justifyContent: 'center', // Center horizontally
      alignItems: 'center', // Center vertically
    },
  });