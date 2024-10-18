import { GameColors } from "@/constants/GameColors";
import { Beast } from "@/Game/Beasts/Beast";
import { useState } from "react";
import { Pressable, View } from "react-native";
import Svg, { Rect, Text } from "react-native-svg";
import { BeastDetailModal } from "./BeastDetailModal";

export function BeastC({
    beast,
    beastClickCallback
}: {
    beast: Beast | null
    beastClickCallback: (beast: Beast | null) => any
}){
    const [showDetail, setShowDetail] = useState(false)

    return <View>
        <Pressable
            onPress={() => beastClickCallback(beast)}
            onLongPress={() => {
                console.log("Long press!")
                setShowDetail(true)
            }}
        >
        <Svg 
            height="50%" 
            width="50%" 
            viewBox="0 0 100 100"
            
        >
            <Rect
                x="15"
                y="15"
                width="70"
                height="70"
                stroke={beast?"red":GameColors['default'].border}
                strokeWidth="2"
                fill={beast?.colors?.[0] ?
                    GameColors[beast.colors[0]].background 
                    : GameColors['default'].background}
            />
        </Svg>
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