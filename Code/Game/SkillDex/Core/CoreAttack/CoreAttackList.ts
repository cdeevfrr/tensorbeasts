import { CountAttack } from "./Dex/CountAttack";
import { MatchColorAttack } from "./Dex/MatchColorAttack";

export const CoreAttackSkills = {
    "CountAttack": CountAttack,
    "MatchColorAttack": MatchColorAttack
} as const

export function CreateCoreAttackSkill<T extends keyof typeof CoreAttackSkills>(
    type: T,
    data: Parameters<(typeof CoreAttackSkills[T])['factory']>[0]
) {
    const classType = CoreAttackSkills[type]
    return classType['factory'](data)
}