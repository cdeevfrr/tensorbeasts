import { Beast } from "@/Game/Beasts/Beast";
import { BeastC } from "./BeastC";

export type LeveledBeast = {
    prev: Beast,
    new: Beast,
}

export function BeastLevelView({
    leveledBeast
}:{
    leveledBeast: LeveledBeast
}) {
    return <BeastC
          beast={leveledBeast.new}
          beastClickCallback={() => {}}
        />
}