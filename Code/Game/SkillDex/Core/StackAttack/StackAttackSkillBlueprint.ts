import { DestroyEvent } from "@/Game/Dungeon/DestroyEvent";
import { StackAttackSkill } from "./StackAttackSkill";
import { PowerSpread } from "@/Game/Dungeon/PowerSpread";

export interface StackAttackSkillBlueprint {
    factory: ({quality}: {quality: number}) => Omit<StackAttackSkill, "type">,
    process: ({
        self, 
        stack
    }: {
        self: StackAttackSkill & any, 
        stack: Array<DestroyEvent>
    }) => PowerSpread
}