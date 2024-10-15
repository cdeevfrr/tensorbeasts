import { accessLocation } from "@/Game/Dungeon/Board"
import { SkillBlueprint } from "./SupportSkillBlueprint"
import { destroyBlocks } from "@/Game/Dungeon/DungeonState"


export const MatchColorBlockDestroy: SkillBlueprint = {
    factory: () => {
        return {
            chargeRequirement: 30,
            name: "Destroy Color",
        }
    },
    execute: (self, dungeonState, caller, props) => {
        // TODO somehow, get a location from the player?
        const location = [0,0,0,0,0]
        const selectedBlock = accessLocation(location, dungeonState.board)
        const selectedColor = selectedBlock?.color || -1
        if (caller.beast.colors && caller.beast.colors.includes(selectedColor)){
            return destroyBlocks(dungeonState, [[0,0,0,0,0]])
        } else {
            return dungeonState
        }
    }

}