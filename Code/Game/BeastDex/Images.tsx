import { GameColors } from "@/constants/GameColors"
import { Beast } from "../Beasts/Beast"
import Svg, { Rect } from "react-native-svg"
import { TimeBaby } from "@/Game/BeastDex/Images/TimeBaby";
import { SpaceBaby } from "@/Game/BeastDex/Images/SpaceBaby";

const svgFunctions = {
    1: TimeBaby,
    2: SpaceBaby,
}

export function lookupSVG(beast: Beast | null) {
    if (beast){
        if (beast.species.toString() in svgFunctions){
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