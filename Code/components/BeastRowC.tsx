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
        { beasts.map((beast, index) => {
            return <BeastC 
              beast={beast} 
              beastClickCallback={beastClickCallback} 
              key={beast? beast.uuid : index}/>
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