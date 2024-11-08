import { Board, Location } from "@/Game/Battle/Board";
import { GroupSkill } from "./CoreGroupSkill";

export interface GroupSkillBlueprint {
    factory: () => GroupSkill,
    nextGroup: (self: GroupSkill, board: Board) => Array<Location> | undefined
}