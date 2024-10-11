import { Block, DungeonState } from "@/Game/Dungeon/DungeonState";
import { View } from "react-native";
import { BlockC } from "./BlockC";

export function BloclBoardC(props: {board: DungeonState["board"]}){

    return <View>
        {props.board.blocks.map((xHyperplane) => {
            const y = 0
            const z = 0
            const a = 0
            const b = 0
            const block = xHyperplane[y][z][a][b]
            return <BlockC dungeonBlock={block}/>
        })}
    </View>
}