// When blocks are destroyed, they add destroy events to the stack.
// When the player clicks "attack", these events are processed into beast attacks.

import { Block } from "./Block";
import { Board } from "./Board";

export interface DestroyEvent {
    blocksDestroyed: Board
}

export function countBlocksDestroyed({
    destroyEvent,
    filter
}: {
    destroyEvent: DestroyEvent,
    filter?: {color?: Array<number>, shape?: Array<number>, number?: Array<number>}
}): number{
    return destroyEvent.blocksDestroyed.blocks.flat().flat().flat().flat()
    .filter((value: Block | null) => {
        // Return early for all falses, otherwise true!
        if (!value){
            return false
        }
        if (filter){
            if (filter.color && !filter.color.includes(value.color)){
                return false
            }
            if (filter.number && !filter.number.includes(value.number)){
                return false
            }
            if (filter.shape && !filter.shape.includes(value.shape)){
                return false
            }
        } else {
            return true
        }
    }).length
}