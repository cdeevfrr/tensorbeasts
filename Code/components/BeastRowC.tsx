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
    // Components that show beasts should try to grow as much as possible.
    // Beast components can shrink infinitely and rely on containing components to
    // give them as much space as possible.
    container: {
      flex: 1,
      flexDirection: 'row',
      // Rely on the child component's flexGrow: 0 setting and the 
      // react default alignItems:stretch here.
      justifyContent: 'flex-start',
    }
  });