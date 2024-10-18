import { CoreAttackSkill } from "../SkillDex/Core/CoreAttack/CoreAttackSkill"
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
}

function expForNextLevel({beast}: {beast: Beast}){
    const growthRate = beast.growthDetails?.growthRate || 1
    return Math.pow(10 / growthRate, beast.level)
}


export function levelUp({beast}: {beast: Beast}){
    const newBeast = JSON.parse(JSON.stringify(beast))

    newBeast.level += 1
    newBeast.experience = Math.max(0, newBeast.experience - expForNextLevel({beast}))

    newBeast.baseHP += Math.floor((newBeast.hpGain + 1) * Math.random())
    newBeast.baseAttack += Math.floor((newBeast.attackGain + 1) * Math.random())
    newBeast.baseDefense += Math.floor((newBeast.defenseGain + 1) * Math.random())

    return newBeast;
}