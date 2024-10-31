import { destroyBlocks } from "@/Game/Battle/BattleState"
import { SkillBlueprint } from "./SupportSkillBlueprint"

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
    psuedolevels: [...Array.from(Array(15).keys())], 
    execute: (self, battleState, caller, props) => {
        return destroyBlocks(battleState, [[0, 0, 0, 0, 0]])
    },
    commonality: 100,
}