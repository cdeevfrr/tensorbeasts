import { GameColors } from "@/constants/GameColors";
import { Block } from "@/Game/Battle/Block";
import { Pressable } from "react-native";
import Svg, { Circle, Rect } from "react-native-svg";

export function BlockC({
    block,
    callback
}: {
    block: Block | null, 
    callback?: ((Block: Block | null) => void)
}){
    if (callback){
        // This conditional pressable has the accidental, 
        // but useful, effect of making the board blocks
        // bigger & overlap each other when they're pressable.
        // Not sure why.
        return <Pressable
          onPress={() => callback(block)}>
            <BlockSVG block={block}/>
        </Pressable>
    }
    return <BlockSVG block={block}/>
}

function BlockSVG ({block}: {block: Block | null}) {
    const colors = block && block.color in GameColors ? 
        GameColors[block.color] :
        GameColors.default
    return <Svg viewBox="0 0 100 100">
        <Circle
            cx="50"
            cy="50"
            r="45"
            stroke={colors.border}
            strokeWidth="2.5"
            fill={colors.background}
        />
    </Svg>
}