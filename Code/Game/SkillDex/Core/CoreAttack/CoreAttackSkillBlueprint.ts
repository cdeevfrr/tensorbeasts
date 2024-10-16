import { DestroyEvent } from "@/Game/Dungeon/DestroyEvent";
import { CoreAttackSkill } from "./CoreAttackSkill";
import { PowerSpread } from "@/Game/Dungeon/PowerSpread";

export interface CoreAttackSkillBlueprint {
    factory: ({quality}: {quality: number}) => Omit<CoreAttackSkill, "type">,
    process: ({
        self, 
        stack
    }: {
        self: CoreAttackSkill & any, 
        stack: Array<DestroyEvent>
    }) => PowerSpread
}