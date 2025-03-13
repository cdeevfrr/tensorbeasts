import { ContinuousThreeGroup } from "./Dex/Continuous";
import { GroupOneColor } from "./Dex/GroupOneColor";

export const CoreGroupSkills = {
    "ContinuousThree": ContinuousThreeGroup,
    "GroupOneColor": GroupOneColor,
}

export function createCoreGroupSkill<T extends keyof typeof CoreGroupSkills>(
    type: T,
    data: Parameters<(typeof CoreGroupSkills[T])['factory']>[0]
) {
    const classType = CoreGroupSkills[type]
    return classType['factory'](data)
}