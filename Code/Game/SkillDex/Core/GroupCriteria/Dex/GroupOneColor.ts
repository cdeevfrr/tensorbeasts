// Form a group of just the bottom block if that block is the correct color. 

import { accessLocation } from "@/Game/Battle/Board";
import { GroupSkillBlueprint } from "../CoreGroupSkillBlueprint";

export const GroupOneColor: GroupSkillBlueprint = {
    factory: () => {
        return {
            name: "Groups of color 1",
            type: "GroupOneColor",
        }
    },
    nextGroup: (self, board) => {
        // To find a match:
        // Scan by locationsIter (x=0 first)
        // Given a particular block, expand it contiguously.
        //     (for matching: same color or same number or something. 
        //      For straights, straight.)
        // Once expanded, check if it hits the match criteria
        const block = accessLocation([0, 0, 0, 0, 0], board)
        if (block){
            if (block.color === 1){
                return [[0,0,0,0,0]]
            }
        }
        return undefined
    }
}