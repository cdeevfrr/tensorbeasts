import { CoreAttackSkill } from "../SkillDex/Core/CoreAttack/CoreAttackSkill"
import { PassiveSkill } from "../SkillDex/Passive/PassiveSkill"
import { SupportSkill } from "../SkillDex/Support/SupportSkill"

// Represents a beast when managing your collection of beasts, outside a dungeon.
export interface Beast {
    uuid: string,
    species: number,
    colors?: Array<number> // Should be nonempty if present.
    numbers?: Array<number> // Should be nonempty if present.
    shapes?: Array<number> // Should be nonempty if present.

    baseHP: number,
    baseAttack: number,
    baseDefense: number,
    // How many points of charge this beast gets every turn?
    // Only really applies to beasts in support?
    // Possible idea. Not implemented yet.
    // baseCharge: number,

    level: number

    growthDetails?: {
        experience: number,

        // How much experience per level. 
        // At 1, beasts often top out at around lvl 100. 
        // At 2, around lvl 200 (which is an additional 2-3 pseudolevels with normal stat gain)
        // At .5, around lvl 50 (which is about one pseudolevel less at normal stat gain.)
        growthRate: number 
    
        // Gains are "how much are these values increased per levelUp".
        hpGain: number,
        attackGain: number,
        defenseGain: number,
        // TODO: maxLevel: number,
    }
    
    // VanguardSkills: Array<VanguardSkill>, // Changes results of matching, eg multiplies damage when ___.
    // CoreSkills: Array<CoreSkill>, // Changes how matching works & dimension length.
    supportSkills: Array<SupportSkill>, // Active effects started by player

    coreAttackSkill?: CoreAttackSkill,
    coreMatchSkill?: {fixME: number} // TODO: MatchSkill

    passiveSkills?: Array<PassiveSkill>
}

export function expForNextLevel({beast}: {beast: Beast}){
    const growthRate = beast.growthDetails?.growthRate || 1
    return Math.pow(10 / growthRate, beast.level)
}


export function levelUp({beast}: {beast: Beast}){
    const newBeast : Beast = JSON.parse(JSON.stringify(beast))

    if (!newBeast.growthDetails){
        throw new Error("Cannot level up a beast with no growth details! " + newBeast)
    }

    newBeast.level += 1
    newBeast.growthDetails.experience = 
        Math.max(0, 
            newBeast.growthDetails.experience - expForNextLevel({beast}))

    newBeast.baseHP += Math.floor((newBeast.growthDetails.hpGain + 1) * Math.random())
    newBeast.baseAttack += Math.floor((newBeast.growthDetails.attackGain + 1) * Math.random())
    newBeast.baseDefense += Math.floor((newBeast.growthDetails.defenseGain + 1) * Math.random())

    return newBeast;
}

export function calcExpReward(b: Beast){
    const c = {
        ...b,
        level: b.level - 1
    }
    return expForNextLevel({beast: c})
}

export function calculateDrop(b: Beast){
    // TODO What to do if b doesn't have growth details?
    // It will for now (dungeon maps include growth details in the beasts they make.)
    // TODO: How to downLevel / downSpecies (if evolved) b
    return b
}