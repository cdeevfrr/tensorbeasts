import { SupportSkill } from "./SupportSkill"
import { BeastState } from "../../Battle/BeastState"
import { BattleState } from "../../Battle/BattleState"
import { Location } from "@/Game/Battle/Board"

export interface SkillBlueprint {
    factory: ({quality}:{quality: number}) => Omit<SupportSkill, 'type'>,
    // Indicates which pseudolevels might see a beast spawn with this core skill
    psuedolevels: Array<number>,
    // Indicates, for a given pseudolevel where this skill can be generated, how rare it should be among other skills.
    // Higher numbers indicate it's more likely to be generated.
    commonality: number, 
    execute: (self: SupportSkill, battleState: BattleState, caller: BeastState, props: any) => BattleState
    // For skills that need the user to select a block to complete,
    // Their 'execute' should set BattleState.processingSkill = {
    //   uuid: thisBeastUUID,
    //   skillNum: caller.supportSkills.indexOf(self)
    // }
    // The UI will then handle asking the user for input and calling 'continue' 
    // once the user has selected input.
    // MAKE SURE TO CLEAR battleState.ProcessingSkill if you're done!
    // 
    // You can keep it populated for as many user block choices as needed.
    continue?: (self: SupportSkill, battleState: BattleState, caller: BeastState, selection: Location) => BattleState
}