import { Block, DungeonState } from "@/Game/Dungeon/DungeonState";
import { View } from "react-native";
import { BlockC } from "./BlockC";

export function BloclBoardC(props: {board: DungeonState["board"]}){

    return <View>
        {props.board.blocks.map((block) => {
            return <BlockC dungeonBlock={block}/>
        })}
    </View>
}