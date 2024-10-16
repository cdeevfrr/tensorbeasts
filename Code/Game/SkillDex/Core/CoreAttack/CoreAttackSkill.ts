export interface CoreAttackSkill {
    quality: number,
    name: string,
    type: string, // Used to lookup the correct `process` function.
}