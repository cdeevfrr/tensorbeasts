import { emptyBoard } from "@/Game/Battle/Board"


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