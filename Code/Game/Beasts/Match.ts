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