import { SupportSkills } from "../SkillDex/Support/SkillTypeList"

// Represents an active skill that can be used by a beast in the support section of a dungeon, 
// once the beast is charged enough.
export interface SupportSkill {
    chargeRequirement: number,
    name: string,
    type: keyof typeof SupportSkills, // TODO: Fix circular imports here?
}