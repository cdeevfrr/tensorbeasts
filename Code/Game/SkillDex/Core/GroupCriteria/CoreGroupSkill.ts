import { CoreGroupSkills } from "./CoreGroupSkillList";

export interface GroupSkill {
    name: string,
    type: keyof typeof CoreGroupSkills
}