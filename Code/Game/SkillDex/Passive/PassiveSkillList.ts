import { BoardSize } from "./BoardSize";

export const PassiveSkills = {
    "BoardSize": BoardSize
}

export function createPassiveSkill<T extends keyof typeof PassiveSkills>(
    type: T,
    data: Parameters<(typeof PassiveSkills[T])['factory']>[0]
) {
    const classType = PassiveSkills[type]
    return classType['factory'](data)
}