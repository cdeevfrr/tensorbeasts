import { destroyBlocks } from "@/Game/Dungeon/DungeonState"
import { SkillBlueprint } from "../SkillBlueprint"

export const SingleBlockDestroy: SkillBlueprint = {
    factory: () => {
        return {
            chargeRequirement: 50,
        }
    },
    execute: (self, dungeonState, caller, props) => {
        return destroyBlocks(dungeonState, [[1, 1, 1, 1, 1]])
    }
}