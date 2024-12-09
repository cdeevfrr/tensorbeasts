import { BlockC } from "./BlockC";
import { FiveDContainer } from "./FiveDContainer";
import { Block } from "@/Game/Battle/Block";
import { accessLocation, Board, Location, locationsIter } from "@/Game/Battle/Board";
import { Animated } from "react-native";
import { ReactNode } from "react";

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
    if (!boardTo){
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
    } else {
        if(!animationPercent){
            throw new Error("Need animationPercent if you have a boardTo")
        }

        const elementLookups: {[id: string]: {
            component: ReactNode, 
            location?: Array<number> | 'up' | 'right',
            location2?: Array<number> | 'up' | 'right'} 
        } = {}

        for (const location of locationsIter(board)){
            const block = accessLocation(location, board)
            if (block){
                elementLookups[block.id] = {
                    component: <BlockC 
                      block={block} 
                      {...(blockCallback? {callback: (block: Block | null) => {
                        blockCallback(block, location)
                      }} :{})}
                      />,
                    location: location,
                }
            }
        }

        for (const location of locationsIter(boardTo)){
            const block = accessLocation(location, boardTo)
            if (block){
                elementLookups[block.id] = {
                    ...elementLookups[block.id],
                    component: <BlockC 
                      block={block} 
                      {...(blockCallback? {callback: (block: Block | null) => {
                        blockCallback(block, location)
                      }} :{})}
                      />,
                    location2: location,
                }
            }
        }

        const elements = Object.keys(elementLookups).map(id => {
            const pending = elementLookups[id]
            if (!pending.location){
                pending.location = "up"
            }
            if (!pending.location2){
                pending.location2 = "right"
            }
            return pending as {component: ReactNode, location: Array<number> | "up" | "right", location2: Array<number> | "up" | "right"}
        })

        return <FiveDContainer elements={elements} animationPercentage={animationPercent}/>
    }



}