import { Beast } from "@/Game/Beasts/Beast";
import { useState } from "react";
import { Pressable, View, StyleSheet } from "react-native";
import { BeastDetailModal } from "./BeastDetailModal";
import { lookupSVG } from "@/Game/BeastDex/Images";

export function BeastC({
    beast,
    beastClickCallback
}: {
    beast: Beast | null
    beastClickCallback: (beast: Beast | null) => any
}){
    const [showDetail, setShowDetail] = useState(false)

    return <View style={styles.view}>
        <Pressable
            onPress={() => beastClickCallback(beast)}
            onLongPress={() => {
                setShowDetail(true)
            }}
        >
        {lookupSVG(beast)}
        </Pressable>
      {showDetail && 
        <BeastDetailModal 
          beast={beast}
          onRequestClose={() => setShowDetail(false)}
          visible={true}
        />
      }
    </View>
}

const styles = StyleSheet.create({
    // Components that show beasts should try to grow as much as possible.
    // Beast components can shrink infinitely and rely on containing components to
    // give them as much space as possible.
    view: {
        // Beasts are usually shown in BeastRow components.
        // These styles let the containing component stretch it to fill 
        // the cross axis (flexDirection: row, alignItems: stretch)
        // but not stretch it any more along the main axis (since flexGrow = 0)
        aspectRatio: 1,
        flexGrow: 0,
    }
})