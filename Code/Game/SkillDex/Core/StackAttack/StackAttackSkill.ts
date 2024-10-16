// TODO: rename StackAttackSkill to CoreAttackSkill
export interface StackAttackSkill {
    quality: number,
    name: string,
    type: string, // Used to lookup the correct `process` function.
}