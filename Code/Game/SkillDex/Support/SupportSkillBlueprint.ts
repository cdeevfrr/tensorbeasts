import { SupportSkill } from "./SupportSkill"
import { BeastState } from "../../Battle/BeastState"
import { BattleState } from "../../Battle/BattleState"
import { Location } from "@/Game/Battle/Board"

export interface SkillBlueprint {
    factory: ({quality}:{quality: number}) => Omit<SupportSkill, 'type'>,
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