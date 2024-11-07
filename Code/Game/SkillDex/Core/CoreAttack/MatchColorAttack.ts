// Count blocks destroyed for each color.
// Power is that number divided by 5, for each color.

import { createPowerSpread } from "@/Game/Battle/PowerSpread";
import { CoreAttackSkillBlueprint } from "./CoreAttackSkillBlueprint";
import { maxColor } from "@/constants/GameColors";
import { accessLocation, locationsIter } from "@/Game/Battle/Board";

export const MatchColorAttack: CoreAttackSkillBlueprint = {
    factory: ({quality}) => {
        return {
            name: "Match color attack " + quality,
            quality,
        }
    },
    process: ({self, stack}) => {
        // Array index is color - 1, since colors start at 1 not 0.
        const includedColors = Array(maxColor - 1).fill(0)
        for (const destroyEvent of stack) {
            for (const location of locationsIter(destroyEvent.blocksDestroyed)){
                const block = accessLocation(location, destroyEvent.blocksDestroyed)
                if (block) {
                    includedColors[block.color - 1] += 1
                }
            }
        }
        
        return createPowerSpread({
            matches: includedColors.map((x, index) => {
                return {color: index + 1}
            }),
            powers: includedColors.map(x => x / 5)
        })
    },

    // Unused, scheduled to be removed from the type.
    pseudolevels: [1]
}
