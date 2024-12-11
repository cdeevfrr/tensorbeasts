// A board represents a grid of blocks in the appropriate number of dimensions.
// In addition to the main board that the player sees, boards can be used to represent things like 
// "A row of 3 blocks was just destroyed" (this might use a 1X3X1X1X1 board)

import { Block } from "./Block";

export type boardDimension = 0 | 1 | 2 | 3 | 4

export interface Board {
    // Dimensions are named x, y, z, a, b.
    // blocks[1][0][0][0][0] is x = 1, y thru b = 0.
    // blocks[x][y][z][a][b]
    // Board is always stored 5D but displayed based on what it contains,
    // so if it's 3X5X1X1X1 it'll look like it's 2D (see fiveDContainer)
    blocks: Array<Array<Array<Array<Array<Block | null>>>>>
}

export type Location = Array<number> // 5D location.

// Iterate through valid locations in this board.
// MUST start at the bottom (x = 0) so that gravity goes in the right direction.
export function locationsIter<T>(board: Board){
    const result = []
    const blocks = board.blocks;
    for (let x = 0; x < blocks.length; x++){
        for (let y = 0; y < blocks[x].length; y++){
            for (let z = 0; z < blocks[x][y].length; z++){
                for (let a = 0; a < blocks[x][y][z].length; a++){
                    for (let b = 0; b < blocks[x][y][z][a].length; b++){
                        result.push([x, y, z, a, b])
                    }
                }
            }
        }
    }
    return result
}

export function accessLocation(location: Location, board: Board): Block | null | undefined{
    return board.blocks[location[0]]?.
      [location[1]]?.
      [location[2]]?.
      [location[3]]?.
      [location[4]]
}

// Careful to only call this on already cloned boards!
export function setLocation(location: Location, board: Board, newValue: Block | null){
    board.blocks[location[0]][location[1]][location[2]][location[3]][location[4]] = newValue
}

// Recursive helper for cloneBoard
function deepCloneBlocks<T>(arr: T): T {
    if (!Array.isArray(arr)) {
      return arr;
    }
  
    return arr.map(deepCloneBlocks) as T;
}

export function cloneBoard(board: Board){
    return {
        blocks: deepCloneBlocks(board.blocks)
    }
}

// Vector addition util function
export function addLocations(l1: Location, l2: Location){
    return l1.map((val, index) => {return val + l2[index]})
}

export function negateLocation(l1: Location){
    return l1.map(val => -val)
}

export function hammingDistance(l1: Location, l2: Location) {
    return l1.map((val, index) => Math.abs(l2[index] - val)).reduce((a, b) => a+b)
}

// Vector util function
export function locationsEqual(l1: Location, l2: Location){
    const result = l1[0] === l2[0] &&
    l1[1] === l2[1] &&
    l1[2] === l2[2] &&
    l1[3] === l2[3] &&
    l1[4] === l2[4]
    return result
}

// Using location as a vector here, not a true location. 
// Assumes at least length of 1 in all dimensions.
// Find the dimensions of this board (Ex, 5X2X5X1X1)
function dimensions(board: Board): Location{
    return [
        board.blocks.length,
        board.blocks[0].length,
        board.blocks[0][0].length,
        board.blocks[0][0][0].length,
        board.blocks[0][0][0][0].length,
    ]
}

// Create an empty board of the given dimensions, eg, a 5X2X1X1X1 board.
// I haven't thought about what happens if one of the dimensions is 0.
export function emptyBoard(dimensions: Array<number>): Board{
    // Have to map here or else every entry in the array points to the same
    // single instance (all future setLocation on any index in the array
    // seem to collapse to the whole board pointing to the same single block)
    // This bug can be hard to catch because as soon as we JSON.parse(JSON.stringify),
    // it goes away.
    return {
        blocks: Array(dimensions[0]).fill(null).map( x => 
            Array(dimensions[1]).fill(null).map( x =>
                Array(dimensions[2]).fill(null).map( x => 
                    Array(dimensions[3]).fill(null).map( x =>
                        Array(dimensions[4]).fill(null).map( x => null)
                    )
                )
            )
        )
    }
}

// Copied from 
// https://stackoverflow.com/questions/53646270/declare-arbitrarily-nested-array-recursive-type-definition
interface NestedArray<T> extends Array<T | NestedArray<T>> {}


/**
 * Return a new board that has one more column in the given dimension.
 * Eg, given a 2X2X2X1X1 board, addColumnToDimension(4) would make a 
 * 2X2X2X1X2 board with the same blocks as before in the preexisting locations
 * and newly genrated blocks in the new locations.
 * @param board 
 * @param dimension 
 * @param generateBlockFunction 
 */
export function addColumnToDimension(
    board: Board, 
    dimension: boardDimension,
    generateBlockFunction: () => Block
): Board {
    // Let's talk about the game plan in this function implementation.
    // Since x is the outermost array, it's the hard case.
    // Let's start with the easy case, dimension b (aka dimension 4)
    // If we want to add one to dimension b, we need to iterate over 
    // board[x][y][z][a] and for each, push a new single block onto the b array.
    // 
    // What if we want to add to a?
    // iterate over board[x][y][z] and push a new array of length len(b) blocks onto that a.
    // 
    // And over z? Hopefully this will make the pattern clear.
    // Iterate over board[x][y] and push a new 2D array [len(a)][len(b)] onto it.
    // 
    // So at the top, you push a new (n-1)D array of dimensions len(y)Xlen(z)Xlen(a)Xlen(b) onto the top level. 

    const result = cloneBoard(board)
    const originalDimensionLengths = dimensions(result)
    const blocks = result.blocks

    if (dimension === 0){
        blocks.push(
            generateBlocks([
                originalDimensionLengths[1], // y
                originalDimensionLengths[2], // z
                originalDimensionLengths[3], // a
                originalDimensionLengths[4], // b
            ], generateBlockFunction) as Block[][][][]
        )
    }
    for (let x = 0; x < blocks.length; x++){
        if (dimension === 1){
            blocks[x].push(
                generateBlocks([
                    originalDimensionLengths[2], // z
                    originalDimensionLengths[3], // a
                    originalDimensionLengths[4], // b
                ], generateBlockFunction) as Block[][][]
            )
        }
        for (let y = 0; y < blocks[x].length; y++){
            if (dimension === 2){
                blocks[x][y].push(
                    generateBlocks([
                        originalDimensionLengths[3], // a
                        originalDimensionLengths[4], // b
                    ], generateBlockFunction) as Block[][]
                )
            }
            for (let z = 0; z < blocks[x][y].length; z++){
                if (dimension === 3){
                    blocks[x][y][z].push(
                        generateBlocks([
                            originalDimensionLengths[4] // b
                        ], generateBlockFunction) as Block[]
                    )
                }
                for (let a = 0; a < blocks[x][y][z].length; a++){
                    if (dimension === 4){
                        blocks[x][y][z][a].push(generateBlockFunction())
                    }
                }
            }
        }
    }

    return result
}

// Unlike emptyBoard(), this any-dimension function should NOT be exported.
// It's a helper function ONLY. External uses should only see 5d boards.
// Given inputs [2, 3, 4]
// it should make a 2X3X4 grid of blocks.
// These are NOT x, y, z, a, b coordinates!!! Sometimes they're 
// z, a, b; sometimes they're x, y, z. 
// Shouldn't be called with an array of more than 5 dimensions.
function generateBlocks(
    dimensions: Array<number>, 
    generateBlockFunction: () => Block
): 
    Block | 
    NestedArray<Block> {

    if (dimensions.length === 0){
        return generateBlockFunction()
    }

    return Array(dimensions[0]).fill(null).map(x => generateBlocks(
        dimensions.slice(1),
        generateBlockFunction
    ))
}

/**
 * Remove a 'column' from this dimension, keeping at least length 1 in that dimension.
 * Eg, if you have a 2X5X1X1X1 board, and you say
 * removeColumnFromDimension(0)
 * removeColumnFromDimension(0)
 * removeColumnFromDimension(4)
 * you'll have a 1X5X1X1X1 board after those operations.
 * @param board 
 * @param dimension 
 */
export function removeColumnFromDimension(
    board: Board, 
    dimension: boardDimension,
): Board {
    // The opposite of addColumnToDimension, but much easier to implement.

    const result = cloneBoard(board)
    const blocks = result.blocks

    // Make a list of all the arrays that we want to pop from.
    // If dimension = 0, this is just blocks.
    // Otherwise, we drill into each dimension, adding all entries in that
    // dimension to the pendingArrays list.
    let pendingArrays: Array<any> = [blocks]
    for (let i = 0; i < dimension; i++){
        const pendingArrays2 = []
        for (const pendingArray of pendingArrays){
            for (const subArray of pendingArray){
                pendingArrays2.push(subArray)
            }
        }
        pendingArrays = pendingArrays2
    }
    
    // If dimension = 2, pendingArrays should now look like
    // [aXb array, aXb array, aXb array, .....]

    for (const array of pendingArrays) {
        if (array.length > 1){
            array.pop()
        }
    }

    return result

}

function fallOneInternal({
    board,
    clone = true,
    generateBlock,
}:{
    board: Board, 
    clone: boolean,
    generateBlock: () => Block
}){
    const newBoard: Board = clone? {...board} : board

    let diffFound = false;

    // Gravity goes in the x direction, x=0 is the bottom of the screen & the bottom of gravity.

    // For each y, z, a, b coordinate:
    //   check at x=0, x=1, x=2, and so on.
    //   If null, grab from the one above (if exists).
    //   If null and at top, generate one. 
    // This relies on the fact that locationsIter presents locations with lower x value first.
    for (const [x, y, z, a, b] of locationsIter(newBoard)){
        // TODO: Clean this up.
        // Boards should be a full on class, exposing a swap function.
        // Heck, we should probably even expose a 'Fall' that just takes a 'generateBlock' function
        // as an arg.
        if (!accessLocation([x,y,z,a,b], newBoard)) {
            diffFound = true
            const above = accessLocation([x+1,y,z,a,b], newBoard) 
            if (above === undefined){
                newBoard.blocks[x][y][z][a][b] = generateBlock()
            } else {
                newBoard.blocks[x][y][z][a][b] = above
                newBoard.blocks[x+1][y][z][a][b] = null
            }
        }
    }

    return {newBoard, diff: diffFound}
}

export function fall({
    board,
    clone = true,
    generateBlock,
}: {
    board: Board, 
    clone: boolean,
    generateBlock: () => Block
}){
    const state = fallOneInternal({board, clone, generateBlock}) 
    while (state.diff){
        const nextState = fallOneInternal({
            board: state.newBoard, 
            clone: false, 
            generateBlock
        }) 
        state.diff = nextState.diff
        state.newBoard = nextState.newBoard
    }
    return state.newBoard
}