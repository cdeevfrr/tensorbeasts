import { Board, Location } from "@/Game/Battle/Board";

export interface GroupSkillBlueprint <
  FactoryArgs, 
  SerializedShape
> {
    factory: (args: FactoryArgs) => {name: string, payload: SerializedShape},
    nextGroup: (args: {payload: SerializedShape, board: Board}) => Array<Location> | undefined
}