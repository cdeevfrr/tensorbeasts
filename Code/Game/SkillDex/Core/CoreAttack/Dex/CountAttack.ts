// Count blocks destroyed to see what your attack is.
// For each instance of this skill, you have a fixed threshold to represent 100% power.
// The actual power this turn will be (count / threshold)
// Higher quality versions of this skill will have lower threshold.

import { countBlocksDestroyed, DestroyEvent } from "@/Game/Battle/DestroyEvent"
import { CoreAttackSkillBlueprint } from "../CoreAttackSkillBlueprint"
import { createPowerSpread } from "@/Game/Battle/PowerSpread"

type CountAttackPayload = {
    threshold: number, 
    quality: number
}


export const CountAttack: CoreAttackSkillBlueprint<{quality: number}, CountAttackPayload> = {
    factory: ({quality}: {quality: number}) => {
        return {
            payload: {
                threshold: 5 - Math.floor(quality / 3),
                quality: quality,
            },
            name: "Count Attack " + quality
        }
    },
    process: ({
        payload, 
        stack
    }:{
        payload: CountAttackPayload
        stack: Array<DestroyEvent>
    }) => {
        const count = stack.map((event) => {
            return countBlocksDestroyed({destroyEvent: event})
        }).reduce((prev, cur) => prev + cur, 1)

        return createPowerSpread({
            matches: [{}],
            powers: [count / payload.threshold]
        })
    },
}
