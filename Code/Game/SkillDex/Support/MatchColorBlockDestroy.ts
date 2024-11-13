import { accessLocation } from "@/Game/Battle/Board"
import { SkillBlueprint } from "./SupportSkillBlueprint"
import { destroyBlocks } from "@/Game/Battle/BattleState"
import { setupContinue } from "./SupportSkill"


export const MatchColorBlockDestroy: SkillBlueprint = {
    factory: ({quality}) => {
        return {
            chargeRequirement: 60 / quality,
            name: "Destroy Color",
        }
    },
    execute: (self, battleState, caller, props) => {
        return setupContinue(self, battleState, caller)
    },
    continue: (self, battleState, caller, selection ) => {
        const result = {
            ...battleState
        }
        delete result.processingSkill

        const selectedBlock = accessLocation(selection, battleState.board)
        const selectedColor = selectedBlock?.color || -1
        if (caller.beast.colors && caller.beast.colors.includes(selectedColor)){
            return destroyBlocks(result, [selection])
        } else {
            return result
        }
    },
    psuedolevels: [...Array.from(Array(15).keys())],
    commonality: 200,
}