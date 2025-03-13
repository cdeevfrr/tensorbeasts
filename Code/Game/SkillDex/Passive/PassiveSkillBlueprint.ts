import { BattleState } from "@/Game/Battle/BattleState";
import { BeastState } from "@/Game/Battle/BeastState";

export interface PassiveBlueprint <
  FactoryArgs extends { quality: number }, 
  SerializedShape
> {
    factory: (args: FactoryArgs) => {name: string, payload: SerializedShape},
    activate?: (payload: SerializedShape, battleState: BattleState, caller: BeastState) => void,
    deactivate?: (payload: SerializedShape, battleState: BattleState, caller: BeastState) => void,
    processStack?: (payload: SerializedShape, battleState: BattleState, caller: BeastState) => {
        // These are first-pass, update as needed.
        atkIncreasePercent?: number,
        defIncreasePercent?: number,
        hpIncreasePercent?: number,
        hpIncreaseAbsolute?: number
    }
}

