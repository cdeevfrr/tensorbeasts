import { destroyBlocks } from "@/Game/Battle/BattleState"
import { SkillBlueprint } from "../SupportSkillBlueprint"
import { setupContinue } from "../SupportSkill"

export const SingleBlockDestroy: SkillBlueprint = {
    factory: ({quality}) => {
        if (quality <= 0){
            quality = 1
        }
        return {
            chargeRequirement: 150 / quality,
            name: "Simple Destroy " + quality
        }
    },
    execute: (self, battleState, caller, props) => {
        return setupContinue(self, battleState, caller)
    },
    continue: (self, battleState, caller, selection ) => {
        const result = destroyBlocks({
            battleState, 
            locations: [selection],
        })
        delete result.processingSkill
        return result
    },
}