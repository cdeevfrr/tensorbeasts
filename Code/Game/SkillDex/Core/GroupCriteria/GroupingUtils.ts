import { Block } from "@/Game/Battle/Block";
import { accessLocation, addLocations, Board, boardDimension, Location, negateLocation } from "@/Game/Battle/Board";

// Note: The expandBorder function is actually extremely suboptimal
// in 5 dimensions (since there are over 200 directions to check
// from one starting location when including diagonals)
//
// It would be better to take in a board, and divide it into
// all groups at once (eg, make a list of pending groups; for each 
// location in the board, add the location to the pending group it
// should be added to; else make a new pending group for it. 
// (Does this handle U shaped groups?) Return
// all pending groups)
// That would be O(board size), instead of the current O(200 * boardSize)


// Given a current set of border locations to check, 
// check each border location in an undefined order.
// If you find a block that matches the matcher, 
// add it to the result & add all neighbors to the border.
// Repeat until the border is empty, and return the result.
//
// If newBlocksOnly, every time a block is added to the inside, the rest of the border is thrown out.
// diagonals defaults to 1, and indicates 
//    "how many dimensions can be increased to still count as a border"
//    Eg, in a 2D grid, the diagonal location would be +1x & +1y 
//    Should this be a border location? If you can include 2 dimensions to make a
//    diagonal, then yes. If you can only include 1 dimension, then either +1x or +1y but 
//    not both are allowed.
//    In a 5D board, +1x and +1y and +1z is a diagonal of 3.
//    Careful: at diagonals=2, there are 50 neighbors, 
//       and at diagonals=5, there are 210!
export function expandBorder({
    initialToVisit,
    board,
    matches,
    newBlocksOnly = false,
    diagonals = 1,
    maxSize = 1000,
}:{
    initialToVisit: Array<Location>, 
    board: Board, 
    matches: ({}:{block: Block | null, currentInside: Array<Location>}) => boolean,
    newBlocksOnly?: boolean,
    diagonals?: number,
    maxSize?: number,
}): Array<Location> {
    const seen = new Set<string>()
    const ToVisit = [...initialToVisit]
    const result = []

    let nextLocation = ToVisit.pop()
    while (nextLocation && result.length <= maxSize){
        // In this recursive call, we only add things to ToVisit
        // if they aren't undefined in the board.
        const block = accessLocation(nextLocation, board)
        if (block === undefined){
            throw new Error("Looks like you tried to expand a group border but your initial inside wasn't in the board!")
        }
        if (matches(
            {block, currentInside: [...result]}
        )){
            result.push(nextLocation)

            const neighborDirections = calculateNeighborDirections(diagonals)
    
            for (const direction of neighborDirections){
                // If following the direction gives a valid, unvisited direction
                // add it to ToVisit.
                const neighborLocation = addLocations(nextLocation, direction)
                if (!seen.has(locationKey(neighborLocation))){
                    if (accessLocation(neighborLocation, board) !== undefined){
                        ToVisit.push(neighborLocation)
                    }
                    seen.add(locationKey(neighborLocation))
                }
            }
        }
        seen.add(locationKey(nextLocation))

        nextLocation = ToVisit.pop()
    }
    
    return result
}

const UnitVectors = [
    [1, 0, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 0, 1],
]

const directions = UnitVectors.map(v => [v, negateLocation(v)]).flat()


const diagonalsMemo: {[key: number]: Array<Location>} = {}
export function calculateNeighborDirections(diagonals: number){
    if (diagonals in diagonalsMemo){
        return diagonalsMemo[diagonals]
    }

    let diagonalsInt = Math.floor(diagonals)
    if (diagonalsInt < 1){
        diagonalsInt = 1
    }
    if (diagonalsInt > 5){
        diagonalsInt = 5
    }
    
    // Inspired by a simple "pick n distinct items from an array"
    // query to chatGPT, this function builds our result
    // recursively by adding this element to the 'current' array
    // and recursing on the right of the remaining array.
    const results: Array<Location> = [];
    const seen = new Set<string>([locationKey([0,0,0,0,0])]);

    function combine(
        current: Array<Location>, 
        remaining: Array<Location>, 
        n: number, 
        results: Array<Location>
    ) {
        if (1 <= current.length && current.length <= n) {
            const neighborLocation = current.reduce(
                (a: Location, b: Location) => addLocations(a, b)
                ,[0,0,0,0,0]
            )
            if (!seen.has(locationKey(neighborLocation))){
                results.push(neighborLocation);
            }
            seen.add(locationKey(neighborLocation))
        }
        if (current.length === n){
            return
        }
        for (let i = 0; i < remaining.length; i++) {
            combine([...current, remaining[i]], remaining.slice(i + 1), n, results);
        }
    }

    combine([], directions, diagonalsInt, results);

    diagonalsMemo[diagonals] = results
    return results;
}

function locationKey(l1: Location){
    return JSON.stringify(l1);
}