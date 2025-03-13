import { MatchColorBlockDestroy } from "./Dex/MatchColorBlockDestroy";
import { SingleBlockDestroy } from "./Dex/SingleBlockDestroy";

export const SupportSkills = {
    "MatchColorBlockDestroy": MatchColorBlockDestroy,
    "SingleBlockDestroy": SingleBlockDestroy,
}

export function createSupportSkill<T extends keyof typeof SupportSkills>(
    type: T,
    data: Parameters<(typeof SupportSkills[T])['factory']>[0]
) {
    const classType = SupportSkills[type]
    return classType['factory'](data)
}