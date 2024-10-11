export interface DungeonState {
    party: Array<BeastState>
    enemies: Array<BeastState>
    board: Board
}

interface Board {
    // Dimensions are named x, y, z, a, b.
    // blocks[1][0][0][0][0] is x = 1, y thru b = 0.
    // blocks[x][y][z][a][b]
    // Board is always stored 5D but displayed based on other settings.
    blocks: Array<Array<Array<Array<Array<Block>>>>>
}

export interface Block {
    color: number,
    // If unmasked, is color shown?
    colorVisible?: boolean,
    shape: number,
    // if unmasked, is shape shown?
    shapeVisible?: boolean,
    number: number,
    // if unmasked, is number shown?
    numberVisible?: boolean,

    masked?: boolean
}