
// Represents a beast when managing your collection of beasts, outside a dungeon.
interface Beast {
    species: number,
    colors: Array<number> // Each color (aka type) is represented by one number.

    baseHP: number,
    baseAttack: number,
    baseDefense: number,
    // How many points of charge this beast gets every turn?
    // Only really applies to beasts in support?
    // Possible idea. Not implemented yet.
    // baseCharge: number,

    level: number
    experience: number,
    growthRate: number // How much experience per level

    // Gains are "how much are these values increased per levelUp".
    hpGain: number,
    attackGain: number,
    defenseGain: number,

    // VanguardSkills: Array<VanguardSkill>, // Changes results of matching, eg multiplies damage when ___.
    // CoreSkills: Array<CoreSkill>, // Changes how matching works & dimension length.
    SupportSkills: Array<SupportSkill>, // Active effects started by player
}