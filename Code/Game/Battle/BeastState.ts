import { Beast } from "../Beasts/Beast";
import { Match } from "../Beasts/Match";
import { Buff } from "./Buff";
import { Target } from "./Target";

// Represents a beast when inside a dungeon (not when managing your beasts)
export interface BeastState {
    beast: Beast,

    maxHP: number,
    currentHP: number,
    currentCharge: number, // Can the beast use its skill(s) yet? This is how charged it is.

    Buffs?: Array<Buff>,

    pendingAttacks?: Array<{
        match: Match,
        power: number,
        target: Target,
    }>
}

export function toBeastState(beast: Beast): BeastState{
    return {
        beast: beast,
        currentCharge: 0,
        currentHP: beast.baseHP,
        maxHP: beast.baseHP,
    }
}