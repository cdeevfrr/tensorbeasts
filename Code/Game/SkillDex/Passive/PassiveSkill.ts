import { PassiveSkills } from "./PassiveSkillList";

// Passive skills will be activated on battle start 
// and deactivated if the beast dies.
// Some kinds of passive skills will also be checked for at each
// attack turn (eg, multiplying attack when certain shapes are in the stack).
// These are controlled by the existence of activate/deactivate/processStack
// functions on the skill of that type.
export interface PassiveSkill{
    name: string, // This is shown to the user. 
    type: keyof typeof PassiveSkills // this is used for deserialization only
    payload: any, // This is used by the skill to decide eg how powerful it is. Individual skills type it more fully.
}