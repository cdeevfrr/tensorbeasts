import { BattleState } from "@/Game/Battle/BattleState";
import { PassiveSkill } from "./PassiveSkill";
import { BeastState } from "@/Game/Battle/BeastState";
import { PowerSpread } from "@/Game/Battle/PowerSpread";

export interface PassiveBlueprint {
    factory: ({quality}: {quality: number}) => Omit<PassiveSkill, 'type'>,
    activate?: (self: PassiveSkill, battleState: BattleState, caller: BeastState) => void,
    deactivate?: (self: PassiveSkill, battleState: BattleState, caller: BeastState) => void,
    processStack?: (self: PassiveSkill, battleState: BattleState, caller: BeastState) => {
        atkIncreasePercent?: number,
        defIncreasePercent?: number,
        hpIncreasePercent?: number,
        hpIncreaseAbsolute?: number
    }
}

