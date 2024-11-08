// Form a group when a continuous block of the same color/number/shape is of size greater than (quality).

import { accessLocation } from "@/Game/Battle/Board";
import { GroupSkillBlueprint } from "./CoreGroupSkillBlueprint";

export const ContinuousGroup: GroupSkillBlueprint = {
    factory: () => {
        return {
            name: "Groups of 3 contiguous (no diagonals)",
            type: "Continuous"
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
            if (block.color !== 2){
                return [[0,0,0,0,0]]
            }
        }
        return undefined
    }
}