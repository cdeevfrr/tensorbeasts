export interface Match {
    color?: number,
    shape?: number,
    number?: number,
}

export type MatchString = string

// This toString function lets us use matches as keys in a powerSpread. 
// It mainly just ensures it's stringified in alphabetical order
export function matchToString(match: Match): MatchString{
    return JSON.stringify(
        {
            color: match.color,
            shape: match.shape,
            number: match.number
        }
    )
}

export function doesMatch(
    thing: {color?: number, shape?: number, number?: number} | null, 
    match: Match
){
    if (thing === null){
        return false
    }
    let matches = true
    if (thing.color && match.color) {
        matches = thing.color === match.color 
    } 
    if (thing.number && match.number) {
        matches = thing.number === match.number 
    } 
    if (thing.shape && match.shape) {
        matches = thing.shape === match.shape 
    } 
    return matches
}