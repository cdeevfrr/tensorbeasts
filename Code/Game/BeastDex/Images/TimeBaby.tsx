import { GameColors } from "@/constants/GameColors";
import Svg, { Rect } from "react-native-svg";

export function TimeBaby({background, foreground, border}:{
    background: keyof typeof GameColors, 
    foreground: keyof typeof GameColors,
    border: keyof typeof GameColors,
}
) {
    <Svg 
        viewBox="0 0 100 100"
    >
        <Rect
            x="15"
            y="15"
            width="70"
            height="70"
            stroke={GameColors[background].border}
            strokeWidth="2"
            fill={GameColors['default'].background}
        />
    </Svg>
}