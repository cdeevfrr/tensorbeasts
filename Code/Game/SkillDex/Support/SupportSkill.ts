import { BeastState } from "@/Game/Battle/BeastState"
import { SupportSkills } from "./SupportSkillList"
import { BattleState } from "@/Game/Battle/BattleState"

// Represents an active skill that can be used by a beast in the support section of a battle, 
// once the beast is charged enough.
export interface SupportSkill {
    chargeRequirement: number,
    name: string,
    type: keyof typeof SupportSkills, // TODO: Fix circular imports here?
    id: string,
    payload: any,
}

// A useful function that many skills use if they just want a block & then to continue.
// See the comment on SupportSkillBlueprint.continue?
export function setupContinue(selfId: string, battleState: BattleState, caller: BeastState) {
    const newBattleState = {
        ...battleState
    }
    const skillNum = caller.beast.supportSkills.findIndex(x => 
        // TODO: Aught to have a way to guarantee uniqueness of skills.
        x.id === selfId
    )
    if (skillNum === -1){
        throw new Error(
            "Called execute on a skill, but that skill didn't exist on the calling beast?" 
            + "Skill: " + JSON.stringify(self) 
            + "Caller: " + JSON.stringify(caller))
    }
    newBattleState.processingSkill = {
        beastUUID: caller.beast.uuid,
        skillNum,
    }
    return newBattleState
}