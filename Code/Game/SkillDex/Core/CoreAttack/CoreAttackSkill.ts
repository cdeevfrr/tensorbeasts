import { CoreAttackSkills } from "./CoreAttackList";

// A Core Attack Skill is used to take in a stack of DestroyEvents and
// decide attack powers for the beasts in the battle
export interface CoreAttackSkill {
    name: string,
    type: keyof typeof CoreAttackSkills, // Used to lookup the correct `process` function.
    payload: any,
}