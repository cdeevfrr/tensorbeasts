import { Block } from "@/Game/Battle/Block"
import { addColumnToDimension, emptyBoard, removeColumnFromDimension } from "@/Game/Battle/Board"


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