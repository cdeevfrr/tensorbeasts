// A power spread represents how much each beast attacks, 
// in terms of beasts with this color/number/shape attack at this power.
// 
// It is sparsely specified.
// For a given beast, _all_ applicable specifications apply.
// If nothing is specified, you have 0%.
//   so, eg, given the power spread:
//       things with color 3 have power 100%
//       things with color 3 and number 2 have power 50%
//       things with color 3 and shape 4 have power 150%
// then 
//    the power of a color 1 is                                      0%,
//    the power of a color 3 number 1 shape 1 is 100%              = 100%
//    the power of a color 3 number 2 shape 1 is 100% * 50%        = 50%
//    the power of a color 3 number 2 shape 4 is 100% * 50% * 150% = 75%
//

export type PowerSpread = Record<MatchString, number>

export type MatchString = string

export interface Match {
    color?: number,
    shape?: number,
    number?: number,
}

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

export function calculateAttack(
    powerSpread: PowerSpread, 
    beast: {
        colors?: Array<number>
        numbers?: Array<number>
        shapes?: Array<number>
    }): Array<Attack> {
        let matches: Array<Match> = [{}]
        if (beast.colors) {
            const newMatches = []
            for (const color of beast.colors){
                for (const match of matches){
                    newMatches.push({
                        ...match,
                        color,
                    })
                }
            }
            matches = newMatches
        } 
        if (beast.numbers){
            const newMatches = []
            for (const number of beast.numbers){
                for (const match of matches){
                    newMatches.push({
                        ...match,
                        number,
                    })
                }
            }
            matches = newMatches
        }
        if (beast.shapes){
            const newMatches = []
            for (const shape of beast.shapes){
                for (const match of matches){
                    newMatches.push({
                        ...match,
                        shape,
                    })
                }
            }
            matches = newMatches
        }

        const result: Array<Attack> = []
        for (const match of matches){
            result.push({
                power: powerForMatch(powerSpread, match),
                match: match
            })
        }
        return result
}

function powerForMatch(powerSpread: PowerSpread, match: Match): number{
    // Check {}, {color}, {number}, {shape}, {color number}, {color shape}, {number shape}, {color, number, shape}
    const multipliers:Array<number | undefined> = [];
    console.log(powerSpread)
    if (match.color){
        const toCheck = {
            color: match.color
        }
        // console.log("checking" + matchToString(toCheck))
        multipliers.push(powerSpread[matchToString(toCheck)])
        if (match.number){
            const toCheck = {
                color: match.color, 
                number: match.number
            }
            // console.log("checking" + matchToString(toCheck))
            multipliers.push(powerSpread[matchToString(toCheck)])
            if (match.shape){
                const toCheck = {
                    color: match.color, 
                    number: match.number, 
                    shape: match.shape
                }
                // console.log("checking" + matchToString(toCheck))
                multipliers.push(powerSpread[matchToString(toCheck)])
            }
        }
        if (match.shape){
            const toCheck = {
                color: match.color, 
                shape: match.shape
            }
            // console.log("checking" + matchToString(toCheck))
            multipliers.push(powerSpread[matchToString(toCheck)])
        }
    }
    if (match.number){
        const toCheck = {
            number: match.number,
        }
        // console.log("checking" + matchToString(toCheck))
        multipliers.push(powerSpread[matchToString(toCheck)])
        if (match.shape){
            const toCheck = {
                number: match.number,
                shape: match.shape,
            }
            multipliers.push(powerSpread[matchToString(toCheck)])
        }
    }
    if (match.shape){
        const toCheck = {
            number: match.number,
            shape: match.shape,
        }
        // console.log("checking" + matchToString(toCheck))
        multipliers.push(powerSpread[matchToString(toCheck)])
    }
    multipliers.push(powerSpread[matchToString({})])

    console.log(multipliers)
    // Types here are weird - we return early before any undefineds can be returned.
    if (multipliers.filter(x => x !== undefined).length == 0){
        return 0
    }
    const result =  multipliers.filter(x => x !== undefined).reduce((prev, curr) => {
        return prev * curr
    }, 1)
    return result
}

export interface Attack {
    power: number,
    match: Match,
}