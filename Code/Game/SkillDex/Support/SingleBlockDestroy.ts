import { destroyBlocks } from "@/Game/Dungeon/DungeonState"
import { SkillBlueprint } from "./SupportSkillBlueprint"

export const SingleBlockDestroy: SkillBlueprint = {
    factory: () => {
        return {
            chargeRequirement: 50,
            name: "Simple Destroy"
        }
    },
    execute: (self, dungeonState, caller, props) => {
        return destroyBlocks(dungeonState, [[0, 0, 0, 0, 0]])
    }
}