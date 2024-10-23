import { BeastState, toBeastState } from "../Battle/BeastState";
import { PartyPlan } from "../Beasts/PartyPlan";

export interface Party {
    // Vanguard beasts have effects like
    //  - if >2 combos, 9X attack
    //  - if >10 of color purple, 2.5X attack
    vanguard: Array<BeastState>
    // Core beasts have stack->attack effects like 
    //  - 'when attacking, count blocks destroyed. All beasts attack at that power' 
    //  - 'when attacking, check if color/number/shape destroyed. All beasts of that color/number/shape attack at 100%'
    //  - 'when attacking, if blocks destroyed > 1, all beasts attack at 100% power'
    // and match-criteria effects (once per attack cycle) like
    //     - a match is a continuous block of one color
    //     - a match is a row of three of the same number
    //     - a match is a 4D cube
    // Core beast effects are always based on majority - the majority of core beasts must have this effect for it to trigger.
    core: Array<BeastState> 
    // Support beasts have active effects, like
    //  - Destroy a fixed/selected block
    //  - move blocks for n seconds (like PAD style movement)
    //  - sort blocks
    //  - Destroy selected block if it matches this beast's color
    //  - Destroy all blocks of color ____
    //  - Replace all blocks like __ with __
    support: Array<BeastState>
}


export interface PartyLocation {
    array: keyof Party,
    index: number
}

export function toParty(partyPlan: PartyPlan) : Party{
    return {
        vanguard: partyPlan.vanguard.filter(x => x !== null).map(toBeastState),
        core: partyPlan.core.filter(x => x !== null).map(toBeastState),
        support: partyPlan.support.filter(x => x !== null).map(toBeastState)
    }
}

// Find the beast at this location.
// If exact is false, it'll look for the first match found,
// first somewhere in the given array (vanguard, core, support), then 
// in neighboring arrays.
// If living is true, it'll keep searching until it finds a living beast.
// Otherwise it'll return the first beast found.
export function beastAt({
    party, 
    location,
    exact = true,
    living = true,
    depth = 0,
}:{
    party: Party, 
    location: PartyLocation,
    exact?: boolean,
    living?: boolean,
    depth?: number, // Just used for tracking recursion depth.
}): BeastState | undefined {
    if (depth > 3){
        // Could not find a match.
        return undefined
    }

    let array = party[location.array]

    let index = location.index

    // If there's a beast at the designated point, return it quickly.

    if (0 <= index && index <= array.length - 1){
        const beast = array[index]
        if (beast && ( beast.currentHP > 0 || (!living))){
            return beast
        }
    }

    // Otherwise, do a bit more work to find the fallback.

    if (exact){
        return undefined
    }

    // If there's no fallback in this array, recurse on a different array.
    const filterF = living? 
        (x: BeastState | null) => x && x.currentHP > 0 :
        (x: BeastState | null) => x
    if (array.filter(filterF).length === 0){
        return beastAt({
            party,
            location: {
                array: addOne(location.array),
                index: location.index
            },
            exact,
            living,
            depth: depth + 1
        })
    }

    // There's a fallback somewhere in this array. 
    // Find the 'closest' valid fallback (just look rightward, loop as needed.)

    if (location.index > array.length - 1){
        index = array.length - 1
    }

    if (location.index < 0){
        index = 0
    }

    let currentBeast = array[index]
    while (!currentBeast || (living && currentBeast.currentHP <= 0)) {
        index += 1
        if (index > array.length){
            index = 0
        }
        currentBeast = array[index]
    }

    return array[index]
}

function addOne(array: keyof Party): keyof Party{
    if (array === 'vanguard'){
        return 'core'
    }
    if (array === 'core'){
        return 'support'
    }
    if (array === 'support'){
        return 'vanguard'
    }
    return 'vanguard'
}