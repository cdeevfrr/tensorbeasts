import { accessLocation } from "@/Game/Battle/Board"
import { SkillBlueprint } from "./SupportSkillBlueprint"
import { destroyBlocks } from "@/Game/Battle/BattleState"


export const MatchColorBlockDestroy: SkillBlueprint = {
    factory: ({quality}) => {
        return {
            chargeRequirement: 60 / quality,
            name: "Destroy Color",
        }
    },
    execute: (self, battleState, caller, props) => {
        // TODO somehow, get a location from the player?
        const location = [0,0,0,0,0]
        const selectedBlock = accessLocation(location, battleState.board)
        const selectedColor = selectedBlock?.color || -1
        if (caller.beast.colors && caller.beast.colors.includes(selectedColor)){
            return destroyBlocks(battleState, [[0,0,0,0,0]])
        } else {
            return battleState
        }
    },
    psuedolevels: [...Array.from(Array(15).keys())],
    commonality: 200,
}