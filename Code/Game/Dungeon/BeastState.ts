// Represents a beast when inside a dungeon (not when managing your beasts)
export interface BeastState {
    beast: Beast,

    maxHP: number,
    currentHP: number,
    currentCharge: number, // Can the beast use its skill(s) yet? This is how charged it is.

    Buffs?: Array<Buff>,
}