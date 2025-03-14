import { DestroyEvent } from "@/Game/Battle/DestroyEvent";
import { CoreAttackSkill } from "./CoreAttackSkill";
import { PowerSpread } from "@/Game/Battle/PowerSpread";

export interface CoreAttackSkillBlueprint <
  FactoryArgs extends { quality: number }, 
  SerializedShape
> {
    
    // Creates a new instance of this skill, that can be saved with a beast.
    factory: (args: FactoryArgs) => {name: string, payload: SerializedShape},
    // Given this stack, say how much each color/number/shape attacks under this skill.
    process: ({
        payload, 
        stack
    }: {
        payload: SerializedShape, 
        stack: Array<DestroyEvent>
    }) => PowerSpread
}