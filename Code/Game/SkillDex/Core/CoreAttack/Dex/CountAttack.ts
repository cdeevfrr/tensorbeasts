// Count blocks destroyed to see what your attack is.
// For each instance of this skill, you have a fixed threshold to represent 100% power.
// The actual power this turn will be (count / threshold)
// Higher quality versions of this skill will have lower threshold.

import { countBlocksDestroyed, DestroyEvent } from "@/Game/Battle/DestroyEvent"
import { CoreAttackSkill } from "../CoreAttackSkill"
import { CoreAttackSkillBlueprint } from "../CoreAttackSkillBlueprint"
import { createPowerSpread } from "@/Game/Battle/PowerSpread"

export const CountAttack: CoreAttackSkillBlueprint = {
    factory: ({quality}: {quality: number}) => {
        return {
            threshold: 5 - Math.floor(quality / 3),
            quality: quality,
            name: "Count Attack " + quality
        }
    },
    process: ({
        self, 
        stack
    }:{
        self: CoreAttackSkill & any
        stack: Array<DestroyEvent>
    }) => {
        const count = stack.map((event) => {
            return countBlocksDestroyed({destroyEvent: event})
        }).reduce((prev, cur) => prev + cur, 1)

        return createPowerSpread({
            matches: [{}],
            powers: [count / self.threshold]
        })
    },
}
