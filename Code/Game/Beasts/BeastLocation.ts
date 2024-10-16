// Represents where, in the dungeon state, a given beast is.
// Eg, core[5] or enemies[3].
// Used for targeting.
export interface BeastLocation {
    array: 'enemies' | 'vanguard' | 'core' | 'support',
    index: number
}