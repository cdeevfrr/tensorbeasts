import { BeastState, toBeastState } from "../Battle/BeastState";
import { PartyPlan } from "../Beasts/PartyPlan";

export interface Party {
    vanguard: Array<BeastState>,
    core: Array<BeastState>,
    support: Array<BeastState>
}

export function toParty(partyPlan: PartyPlan) : Party{
    return {
        vanguard: partyPlan.vanguard.filter(x => x !== null).map(toBeastState),
        core: partyPlan.core.filter(x => x !== null).map(toBeastState),
        support: partyPlan.support.filter(x => x !== null).map(toBeastState)
    }
}