import { GameColors } from "@/constants/GameColors";
import { Beast } from "@/Game/Beasts/Beast";
import Svg, { Rect, Text } from "react-native-svg";

export function BeastC({
    beast,
    beastClickCallback
}: {
    beast: Beast | null
    beastClickCallback: (beast: Beast | null) => any
}){
    return <Svg height="50%" width="50%" viewBox="0 0 100 100">
        <Rect onPress={() => beastClickCallback(beast)}
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
}