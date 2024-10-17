import { destroyBlocks } from "@/Game/Battle/BattleState"
import { SkillBlueprint } from "./SupportSkillBlueprint"

export const SingleBlockDestroy: SkillBlueprint = {
    factory: () => {
        return {
            chargeRequirement: 50,
            name: "Simple Destroy"
        }
    },
    psuedolevels: [...Array.from(Array(15).keys())], 
    execute: (self, battleState, caller, props) => {
        return destroyBlocks(battleState, [[0, 0, 0, 0, 0]])
    },
    commonality: 100,
}