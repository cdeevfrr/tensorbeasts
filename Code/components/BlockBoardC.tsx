import { BattleState } from "@/Game/Battle/BattleState";
import { BlockC } from "./BlockC";
import { FiveDContainer } from "./FiveDContainer";

export function BlockBoardC({board}: {board: BattleState["board"]}){

    const elements: Parameters<typeof FiveDContainer>[0]['elements'] = []
    for (let x = 0; x < board.blocks.length; x++){
        for (let y = 0; y < board.blocks[x].length; y++){
            for (let z = 0; z < board.blocks[x][y].length; z++){
                for (let a = 0; a < board.blocks[x][y][z].length; a++){
                    for (let b = 0; b < board.blocks[x][y][z][a].length; b++){
                        const block = board.blocks[x][y][z][a][b]
                        elements.push({
                            component: <BlockC block={block} />,
                            location: [x, y, z, a, b],
                        })
                    }
                }
            }
        }
    }

    return <FiveDContainer elements={elements}/>
}