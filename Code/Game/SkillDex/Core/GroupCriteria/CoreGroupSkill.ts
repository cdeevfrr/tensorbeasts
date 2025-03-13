import { CoreGroupSkills } from "./CoreGroupSkillList";
// Core group skills make groups of blocks on the board and send those groups into the stack.
// Core attack skills process the stack into attack powers.

export interface GroupSkill {
    name: string, // shown to user 
    type: keyof typeof CoreGroupSkills, // For serialization only
    payload: any,
}