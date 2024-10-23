import { PartyLocation } from "../Dungeon/Party";

// Represents one beast targeting another beast somewhere in the battleState
export interface Target {
    party: 'enemyParty' | 'playerParty',
    partylocation: PartyLocation
}
