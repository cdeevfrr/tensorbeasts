import { Board, Location } from "../Battle/Board"
import { calculateNeighborDirections, expandBorder } from "../SkillDex/Core/GroupCriteria/GroupingUtils"

it('Finds neighbor directions correctly', () => {
    expect(new Set(calculateNeighborDirections(1))).toEqual(new Set([
        [1, 0, 0, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 1, 0],
        [0, 0, 0, 0, 1],
        [-1, 0, 0, 0, 0],
        [0, -1, 0, 0, 0],
        [0, 0, -1, 0, 0],
        [0, 0, 0, -1, 0],
        [0, 0, 0, 0, -1],
    ]))

    const result2 = calculateNeighborDirections(2)
    expect(new Set(result2).size).toEqual(result2.length)    
    
    const expected = [
        [1, 0, 0, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 1, 0],
        [0, 0, 0, 0, 1],
        [-1, 0, 0, 0, 0],
        [0, -1, 0, 0, 0],
        [0, 0, -1, 0, 0],
        [0, 0, 0, -1, 0],
        [0, 0, 0, 0, -1],
        
        [1, 1, 0, 0, 0],
        [1, 0, 1, 0, 0],
        [1, 0, 0, 1, 0],
        [1, 0, 0, 0, 1],
        [1, -1, 0, 0, 0],
        [1, 0, -1, 0, 0],
        [1, 0, 0, -1, 0],
        [1, 0, 0, 0, -1],

        // [1, 1, 0, 0, 0],
        [0, 1, 1, 0, 0],
        [0, 1, 0, 1, 0],
        [0, 1, 0, 0, 1],
        [-1, 1, 0, 0, 0],
        [0, 1, -1, 0, 0],
        [0, 1, 0, -1, 0],
        [0, 1, 0, 0, -1],

        // [1, 0, 1, 0, 0],
        // [0, 1, 1, 0, 0],
        [0, 0, 1, 1, 0],
        [0, 0, 1, 0, 1],
        [-1, 0, 1, 0, 0],
        [0, -1, 1, 0, 0],
        [0, 0, 1, -1, 0],
        [0, 0, 1, 0, -1],

        // [1, 0, 0, 1, 0],
        // [0, 1, 0, 1, 0],
        // [0, 0, 1, 1, 0],
        [0, 0, 0, 1, 1],
        [-1, 0, 0, 1, 0],
        [0, -1, 0, 1, 0],
        [0, 0, -1, 1, 0],
        [0, 0, 0, 1, -1],

        // [1, 0, 0, 0, 1],
        // [0, 1, 0, 0, 1],
        // [0, 0, 1, 0, 1],
        // [0, 0, 0, 1, 1],
        [-1, 0, 0, 0, 1],
        [0, -1, 0, 0, 1],
        [0, 0, -1, 0, 1],
        [0, 0, 0, -1, 1],

        // [-1, 1, 0, 0, 0],
        // [-1, 0, 1, 0, 0],
        // [-1, 0, 0, 1, 0],
        // [-1, 0, 0, 0, 1],
        [-1, -1, 0, 0, 0],
        [-1, 0, -1, 0, 0],
        [-1, 0, 0, -1, 0],
        [-1, 0, 0, 0, -1],

        // [1, -1, 0, 0, 0],
        // [0, -1, 1, 0, 0],
        // [0, -1, 0, 1, 0],
        // [0, -1, 0, 0, 1],
        // [-1, -1, 0, 0, 0],
        [0, -1, -1, 0, 0],
        [0, -1, 0, -1, 0],
        [0, -1, 0, 0, -1],

        // [1, 0, -1, 0, 0],
        // [0, 1, -1, 0, 0],
        // [0, 0, -1, 1, 0],
        // [0, 0, -1, 0, 1],
        // [-1, 0, -1, 0, 0],
        // [0, -1, -1, 0, 0],
        [0, 0, -1, -1, 0],
        [0, 0, -1, 0, -1],

        // [1, 0, 0, -1, 0],
        // [0, 1, 0, -1, 0],
        // [0, 0, 1, -1, 0],
        // [0, 0, 0, -1, 1],
        // [-1, 0, 0, -1, 0],
        // [0, -1, 0, -1, 0],
        // [0, 0, -1, -1, 0],
        [0, 0, 0, -1, -1],

        // [1, 0, 0, 0, -1],
        // [0, 1, 0, 0, -1],
        // [0, 0, 1, 0, -1],
        // [0, 0, 0, 1, -1],
        // [-1, 0, 0, 0, -1],
        // [0, -1, 0, 0, -1],
        // [0, 0, -1, 0, -1],
        // [0, 0, 0, -1, -1],
    ]

    const sortFn = (a: Location, b: Location) => JSON.stringify(a) > JSON.stringify(b)? 1 : -1

    result2.sort(sortFn)
    expected.sort(sortFn)

    expect(result2).toEqual(expected)


    // For this next expecation, I asked chat GPT.
    //
    //  "In a 5 dimensional space, how many neighbors does a grid point have, 
    //     if you can only reach a neighbor by following a single grid line? 
    //     It should be 10, right (two for each dimension)?""
    //
    //     What about if a neighbor can be reached by following up to n grid 
    //     lines? So, for n = 2,  you can add 1 to the x dimension and then 
    //     add 1 to the y dimension to find a neighbor (or, as before, just 
    //     add/subtract 1 to/from the x dimension)"
    //
    //
    // It correctly found 50 for 2 dimensions, and used this explanation:
    // 
    // For each combination of k dimensions (where k ranges from 1 to n), 
    // you can move either +1 or -1 along each chosen dimension.
    // The number of neighbors you can reach this way is given by:
    //
    // sum_{k=1}^n (5 choose k) * 2^n
    //
    // where (5 choose k) is the number of ways to choose k dimensions out of 5
    // 2^k accounts for the different ways to add or subtract 1 in each of those k dimensions
    //
    // So for 3, we need (5 choose 3) * 8 = 10 * 8 = 80
    expect(calculateNeighborDirections(3).length).toEqual(
        10 +
        40 +
        80
    )

    expect(calculateNeighborDirections(4).length).toEqual(
        10 +
        40 +
        80 +
        5 * 16
    )
})

it('expands borders correctly', () => {
    const board: Board = {
        blocks: [
            [[[[{color: 1, number: 1, shape: 1}]]], [[[{color: 1, number: 1, shape: 1}]]]],
            [[[[{color: 5, number: 1, shape: 1}]]], [[[{color: 5, number: 1, shape: 1}]]]],
            [[[[{color: 1, number: 1, shape: 1}]]], [[[{color: 5, number: 1, shape: 1}]]]],
            [[[[{color: 1, number: 1, shape: 1}]]], [[[{color: 5, number: 1, shape: 1}]]]],
            [[[[{color: 1, number: 1, shape: 1}]]], [[[{color: 5, number: 1, shape: 1}]]]],
        ]
    }

    expect(expandBorder({
        board,
        initialToVisit: [[4,0,0,0,0]],
        matches: (({block}) => !!block && block.color === 1)
    })).toEqual([
        [4,0,0,0,0],
        [3,0,0,0,0],
        [2,0,0,0,0],
    ])

    const board2: Board = {
        blocks: [
            [[[[{color: 1, number: 1, shape: 1}]]], [[[{color: 1, number: 1, shape: 1}]]]],
            [[[[null                           ]]], [[[{color: 1, number: 1, shape: 1}]]]],
            [[[[{color: 1, number: 1, shape: 1}]]], [[[{color: 5, number: 1, shape: 1}]]]],
            [[[[{color: 1, number: 1, shape: 1}]]], [[[{color: 5, number: 1, shape: 1}]]]],
            [[[[{color: 1, number: 1, shape: 1}]]], [[[{color: 5, number: 1, shape: 1}]]]],
        ]
    }

    expect(expandBorder({
        board: board2,
        initialToVisit: [[4,0,0,0,0]],
        matches: (({block}) => !!block && block.color === 1)
    })).toEqual([
        [4,0,0,0,0],
        [3,0,0,0,0],
        [2,0,0,0,0],
    ])

    expect(expandBorder({
        board: board2,
        initialToVisit: [[4,0,0,0,0]],
        matches: (({block}) => !!block && block.color === 1),
        diagonals: 2,
    })).toEqual([
        [4,0,0,0,0],
        [3,0,0,0,0],
        [2,0,0,0,0],
        [1,1,0,0,0],
        [0,1,0,0,0],
        [0,0,0,0,0],
    ])
})