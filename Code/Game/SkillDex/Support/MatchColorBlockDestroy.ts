import { accessLocation } from "@/Game/Dungeon/Board"
import { SkillBlueprint } from "../SkillBlueprint"
import { destroyBlocks } from "@/Game/Dungeon/DungeonState"


export const MatchColorBlockDestroy: SkillBlueprint = {
    factory: () => {
        return {
            chargeRequirement: 30,
        }
    },
    execute: (self, dungeonState, caller, props) => {
        // TODO somehow, get a location from the player.
        const location = [1, 1, 1, 1, 1]
        const selectedBlock = accessLocation(location, dungeonState.board)
        const selectedColor = selectedBlock?.color || -1
        if (caller.colors.includes(selectedColor)){
            return destroyBlocks(dungeonState, [[1, 1, 1, 1, 1]])
        } else {
            return dungeonState
        }
    }

}