import { Beast } from "@/Game/Beasts/Beast"
import { BeastC } from "./BeastC"
import { ScrollView, StyleSheet, View } from "react-native"

export function BoxC({
    box,
    canSelectNull,
    beastClickedCallback,
}:{
    box: Array<Beast>
    canSelectNull: boolean,
    beastClickedCallback: (beast: Beast | null) => void,
}){
    let modifiedBox: Array<Beast | null> = box

    if (canSelectNull) {
        modifiedBox = [
            null,
            ...modifiedBox
        ]
    }

    return <ScrollView style={styles.scrollViewContainer}>
       <View style={styles.container}>
            {modifiedBox.map((beast) => {
                return <BeastC 
                beast={beast} 
                beastClickCallback={beastClickedCallback}
                key={beast && beast.uuid}/>
            })}
        </View>
    </ScrollView>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollViewContainer: {
        width: '100%',
        height: '100%',
    },
})