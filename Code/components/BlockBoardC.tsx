import { BattleState } from "@/Game/Battle/BattleState";
import { BlockC } from "./BlockC";
import { FiveDContainer } from "./FiveDContainer";
import { Block } from "@/Game/Battle/Block";
import { Board, Location } from "@/Game/Battle/Board";
import { Animated } from "react-native";

export function BlockBoardC({
    board,
    blockCallback,
    boardTo,
    animationPercent,
}: {
    board: Board,
    blockCallback: ((block: Block | null, location: Location) => void) | null,
    boardTo?: Board,
    animationPercent?: Animated.Value
}){
    const elements: Parameters<typeof FiveDContainer>[0]['elements'] = []
    for (let x = 0; x < board.blocks.length; x++){
        for (let y = 0; y < board.blocks[x].length; y++){
            for (let z = 0; z < board.blocks[x][y].length; z++){
                for (let a = 0; a < board.blocks[x][y][z].length; a++){
                    for (let b = 0; b < board.blocks[x][y][z][a].length; b++){
                        const block = board.blocks[x][y][z][a][b]
                        elements.push({
                            component: <BlockC 
                              block={block} 
                              {...(blockCallback? {callback: (block: Block | null) => {
                                blockCallback(block, [x, y, z, a, b])
                              }} :{})}
                              />,
                            location: [x, y, z, a, b],
                        })
                    }
                }
            }
        }
    }

    return <FiveDContainer elements={elements}/>
}