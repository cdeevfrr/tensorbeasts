import { SupportSkill } from "./SupportSkill"
import { BeastState } from "../../Battle/BeastState"
import { BattleState } from "../../Battle/BattleState"

export interface SkillBlueprint {
    factory: ({quality}:{quality: number}) => Omit<SupportSkill, 'type'>,
    // Indicates which pseudolevels might see a beast spawn with this core skill
    psuedolevels: Array<number>,
    // Indicates, for a given pseudolevel where this skill can be generated, how rare it should be among other skills.
    // Higher numbers indicate it's more likely to be generated.
    commonality: number, 
    execute: (self: SupportSkill, battleState: BattleState, caller: BeastState, props: any) => BattleState
}