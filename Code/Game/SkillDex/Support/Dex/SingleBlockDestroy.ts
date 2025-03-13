import { destroyBlocks } from "@/Game/Battle/BattleState"
import { SkillBlueprint } from "../SupportSkillBlueprint"
import { setupContinue } from "../SupportSkill"

export const SingleBlockDestroy: SkillBlueprint<{quality: number}, {}> = {
    factory: ({quality}) => {
        if (quality <= 0){
            quality = 1
        }
        return {
            chargeRequirement: 150 / quality,
            name: "Simple Destroy " + quality,
            payload: {},
        }
    },
    execute: ({payload, selfId, battleState, caller}) => {
        return setupContinue(selfId, battleState, caller)
    },
    continue: ({payload, selfId, battleState, caller, selection}) => {
        const result = destroyBlocks({
            battleState, 
            locations: [selection],
        })
        delete result.processingSkill
        return result
    },
}