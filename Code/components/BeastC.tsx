import { GameColors } from "@/constants/GameColors";
import { Beast } from "@/Game/Beasts/Beast";
import { useState } from "react";
import { Pressable, View, StyleSheet } from "react-native";
import Svg, { Rect } from "react-native-svg";
import { BeastDetailModal } from "./BeastDetailModal";
import { TimeBaby } from "@/Game/BeastDex/Images/TimeBaby";
import { SpaceBaby } from "@/Game/BeastDex/Images/SpaceBaby";

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

const svgFunctions = {
    1: TimeBaby,
    2: SpaceBaby,
}
function lookupSVG(beast: Beast | null) {
    if (beast){
        if (beast.species in svgFunctions){
            const f = svgFunctions[beast.species as keyof typeof svgFunctions]
            return f({colors: beast.colors as Array<keyof typeof GameColors>})
        }
    }
    // Default image is just a box with fill based on beast color and a red border.
    return <Svg
        viewBox="0 0 100 100"

    >
        <Rect
            x="15"
            y="15"
            width="70"
            height="70"
            stroke={beast ? "red" : GameColors['default'].border}
            strokeWidth="2"
            fill={beast?.colors?.[0] ?
                GameColors[beast.colors[0] as keyof typeof GameColors].background
                : GameColors['default'].background}
        />
    </Svg>
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