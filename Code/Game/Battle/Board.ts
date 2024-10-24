// A board represents a grid of blocks in the appropriate number of dimensions.
// In addition to the main board that the player sees, boards can be used to represent things like 
// "A row of 3 blocks was just destroyed" (this might use a 1X3X1X1X1 board)

import { Block } from "./Block";

export interface Board {
    // Dimensions are named x, y, z, a, b.
    // blocks[1][0][0][0][0] is x = 1, y thru b = 0.
    // blocks[x][y][z][a][b]
    // Board is always stored 5D but displayed based on other settings.
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

export function addLocations(l1: Location, l2: Location){
    return l1.map((val, index) => {return val + l2[index]})
}

export function locationsEqual(l1: Location, l2: Location){
    console.log(l1)
    console.log(l2)
    const result = l1[0] === l2[0] &&
    l1[1] === l2[1] &&
    l1[2] === l2[2] &&
    l1[3] === l2[3] &&
    l1[4] === l2[4]
    console.log(result)
    return result
}

export function emptyBoard(dimensions: Array<number>): Board{
    return {
        blocks: Array(dimensions[0]).fill(
            Array(dimensions[1]).fill(
                Array(dimensions[2]).fill(
                    Array(dimensions[3]).fill(
                        Array(dimensions[4]).fill(
                            null
                        )
                    )
                )
            )
        )
    }
}