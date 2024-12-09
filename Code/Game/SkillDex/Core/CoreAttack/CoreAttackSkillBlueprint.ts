import { DestroyEvent } from "@/Game/Battle/DestroyEvent";
import { CoreAttackSkill } from "./CoreAttackSkill";
import { PowerSpread } from "@/Game/Battle/PowerSpread";

export interface CoreAttackSkillBlueprint {
    // Creates a new instance of this skill, that can be saved with a beast.
    factory: ({quality}: {quality: number}) => Omit<CoreAttackSkill, "type">,
    // Given this stack, say how much each color/number/shape attacks under this skill.
    process: ({
        self, 
        stack
    }: {
        self: CoreAttackSkill & any, 
        stack: Array<DestroyEvent>
    }) => PowerSpread
}