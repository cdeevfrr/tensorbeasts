import { CoreAttackSkills } from "./CoreAttackList";

export interface CoreAttackSkill {
    quality: number,
    name: string,
    type: keyof typeof CoreAttackSkills, // Used to lookup the correct `process` function.
}