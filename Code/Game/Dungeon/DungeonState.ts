export interface DungeonState {
    party: Array<BeastState>
    enemies: Array<BeastState>
    board: Board
}

interface Board {
    xLength: number, // x is vertical. Blocks always fall vertically. x = 0 is the bottom block.
    yLength: number, // y is left and right. y = 0 is the left block.
    zLength: number, // z is into the screen. z = 0 is the closest block to you.
    aLength: number, // a is vertical. Grids stack vertically. a = 0 is the bottom grid.
    bLength: number, // b is horizontal. Grids stack horizontally. b = 0 is the left grid.
    blocks: Array<Block> // Fills x dimension, then y, then z, then a, then b.
    // Note: For any fixed y,z,a,b coordinate, the x=n block falls from location x=n+1. 
    // If there is no n+1 on this board, the block is generated.
}

export interface Block {
    color: number,
    shape: number,
    number: number,
}