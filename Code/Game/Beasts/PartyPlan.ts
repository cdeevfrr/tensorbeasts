import { Beast } from "./Beast";

export interface PartyPlan {
    vanguard: Array<Beast | null>,
    core: Array<Beast | null>,
    support: Array<Beast | null>
}

export function recheckSizes(p: PartyPlan): PartyPlan {
    let vanguardSize = 2;
    let coreSize = 2;
    let supportSize = 2;

    // TODO: look at beast effects and set correct sizes

    return {
        vanguard: p.vanguard.slice(0, vanguardSize),
        core: p.core.slice(0, coreSize),
        support: p.support.slice(0, supportSize)
    }
}


// TODO: this has a ton of overlap with BeastLocation. figure out how to combine.
export interface  BeastPartyLocation {
    array: 'vanguard' | 'core' | 'support',
    index: number
}