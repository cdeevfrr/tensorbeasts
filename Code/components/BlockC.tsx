import { GameColors } from "@/constants/GameColors";
import { Block } from "@/Game/Battle/Block";
import Svg, { Circle, Rect } from "react-native-svg";

export function BlockC({block}: {block: Block | null, }){
    const colors = block && block.color in GameColors ? 
        GameColors[block.color] :
        GameColors.default
    return <Svg height="50%" width="50%" viewBox="0 0 100 100">
        <Circle onPress={() => console.log('Component tapped!')}
            cx="50"
            cy="50"
            r="45"
            stroke={colors.border}
            strokeWidth="2.5"
            fill={colors.background}
        />
    </Svg>
}