import { Block } from "@/Game/Battle/Block"
import { addColumnToDimension, emptyBoard, fall, removeColumnFromDimension, setLocation } from "@/Game/Battle/Board"


it('creates empty boards correctly', () => {
    expect(emptyBoard([
        5,1,1,1,1
    ]).blocks).toEqual([
        [[[[null]]]],
        [[[[null]]]],
        [[[[null]]]],
        [[[[null]]]],
        [[[[null]]]],
    ])
})

// Helper function for tests, must always generate the same block.
function generateBlock(): Block {
    return {
        color: 1,
        number: 1,
        shape: 1,
    }
}

it('Adds dimensions correctly', () => {
    const initialBoard = emptyBoard([5, 1, 1, 1, 1])

    const addedX = addColumnToDimension(initialBoard, 0, generateBlock)

    expect(addedX.blocks).toEqual([
        [[[[null]]]],
        [[[[null]]]],
        [[[[null]]]],
        [[[[null]]]],
        [[[[null]]]],
        [[[[generateBlock()]]]],
    ])

    const addedY = addColumnToDimension(initialBoard, 1, generateBlock)

    expect(addedY.blocks).toEqual([
        [[[[null]]],[[[generateBlock()]]]],
        [[[[null]]],[[[generateBlock()]]]],
        [[[[null]]],[[[generateBlock()]]]],
        [[[[null]]],[[[generateBlock()]]]],
        [[[[null]]],[[[generateBlock()]]]],
    ])

    const addedZ = addColumnToDimension(addedY, 2, generateBlock)

    expect(addedZ.blocks).toEqual([
        [[[[null]],[[generateBlock()]]],[[[generateBlock()]],[[generateBlock()]]]],
        [[[[null]],[[generateBlock()]]],[[[generateBlock()]],[[generateBlock()]]]],
        [[[[null]],[[generateBlock()]]],[[[generateBlock()]],[[generateBlock()]]]],
        [[[[null]],[[generateBlock()]]],[[[generateBlock()]],[[generateBlock()]]]],
        [[[[null]],[[generateBlock()]]],[[[generateBlock()]],[[generateBlock()]]]],
    ])

    const addedA = addColumnToDimension(initialBoard, 3, generateBlock)
    expect(addedA.blocks).toEqual([
        [[[[null], [generateBlock()]]]],
        [[[[null], [generateBlock()]]]],
        [[[[null], [generateBlock()]]]],
        [[[[null], [generateBlock()]]]],
        [[[[null], [generateBlock()]]]],
    ])

    const addedB = addColumnToDimension(initialBoard, 4, generateBlock)
    expect(addedB.blocks).toEqual([
        [[[[null, generateBlock()]]]],
        [[[[null, generateBlock()]]]],
        [[[[null, generateBlock()]]]],
        [[[[null, generateBlock()]]]],
        [[[[null, generateBlock()]]]],
    ])
})

it('Removes dimensions correctly', () => {
    const initialBoard = emptyBoard([5, 1, 1, 1, 1])

    const constructed = addColumnToDimension(
        addColumnToDimension(
            addColumnToDimension(
                initialBoard, 
                1, 
                generateBlock),
            0,
            generateBlock
        ),
        0,
        generateBlock
    )

    // Setup expectation for readability
    expect(constructed.blocks).toEqual([
        [[[[null]]],[[[generateBlock()]]]],
        [[[[null]]],[[[generateBlock()]]]],
        [[[[null]]],[[[generateBlock()]]]],
        [[[[null]]],[[[generateBlock()]]]],
        [[[[null]]],[[[generateBlock()]]]],
        [[[[generateBlock()]]],[[[generateBlock()]]]],
        [[[[generateBlock()]]],[[[generateBlock()]]]],
    ])

    expect(removeColumnFromDimension(constructed, 1).blocks).toEqual([
        [[[[null]]]],
        [[[[null]]]],
        [[[[null]]]],
        [[[[null]]]],
        [[[[null]]]],
        [[[[generateBlock()]]]],
        [[[[generateBlock()]]]],
    ])

    expect(removeColumnFromDimension(constructed, 0).blocks).toEqual([
        [[[[null]]],[[[generateBlock()]]]],
        [[[[null]]],[[[generateBlock()]]]],
        [[[[null]]],[[[generateBlock()]]]],
        [[[[null]]],[[[generateBlock()]]]],
        [[[[null]]],[[[generateBlock()]]]],
        [[[[generateBlock()]]],[[[generateBlock()]]]],
    ])

    // Shouldn't remove last dimension
    expect(removeColumnFromDimension(constructed, 3).blocks).toEqual(
        constructed.blocks
    )

})

it('falls correctly', () => {
    let board = emptyBoard([3,3,1,1,1])
    setLocation([2,2,0,0,0], board, {color: 8, number: 8, shape: 8})

    // Should start looking like
    // [[[[null]]],[[[null]]],[[[null]]]],
    // [[[[null]]],[[[null]]],[[[null]]]],
    // [[[[null]]],[[[null]]],[[[{8, 8, 8}]]]],

    // We fall 'upwards' because we oriented gravity as negative x, and
    // we oriented x=0 as the first entry in the array and x=2 as the last.

    // So after the first fall step, it should look like
    // [[[[null]]],[[[null]]],[[[null]]]],
    // [[[[null]]],[[[null]]],[[[{8, 8, 8}]]]],
    // [[[[{1, 0, 0}]]],[[[{2, 0, 0}]]],[[[{3, 0, 0}]]]],

    // Repeating falls, you get to the expected state.

    let count = 0
    const changingGenerate = () => {
        count += 1
        return {
            color: count,
            number: 0,
            shape: 0
        }
    }

    board = fall({
        board,
        clone: false,
        generateBlock: changingGenerate,
    })

    expect(board.blocks).toEqual([
        [[[[{color: 1, number: 0, shape: 0}]]],[[[{color: 2, number: 0, shape: 0}]]],[[[{color: 8, number: 8, shape: 8}]]]],
        [[[[{color: 4, number: 0, shape: 0}]]],[[[{color: 5, number: 0, shape: 0}]]],[[[{color: 3, number: 0, shape: 0}]]]],
        [[[[{color: 7, number: 0, shape: 0}]]],[[[{color: 8, number: 0, shape: 0}]]],[[[{color: 6, number: 0, shape: 0}]]]],
    ])
})