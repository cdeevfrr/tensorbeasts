import { DungeonState, generateNewDungeonRun, updateSeen } from "@/Game/Dungeon/DungeonState";
import { DungeonMap } from "@/Game/DungeonMap/DungeonMap";


// Wish this mock wasn't needed.
// Got errors from JUST jest.
// https://stackoverflow.com/questions/73203367/jest-syntaxerror-unexpected-token-export-with-uuid-library
jest.mock('uuid', () => {
    return {
      v4: jest.fn(() => 1)
    }
})

const fakeMap: DungeonMap = {
    getBattleAt: () => [],
    getTileAt({ location }) {
        return {
            image: () => null as unknown as React.JSX.Element,
            opaque: false,
            walkable: true,
        }
    },
    id: 'unused'
}

function makeEmptyDungeonState (): DungeonState {
    return {
        seen: [],
        visited: [],
        map: fakeMap,
        location: [0, 0, 0, 0, 0],
        party: {core: [], support: [], vanguard: []},
        spoils: [],
    }
}

it('Loads seen indexes correctly', () => {
    const d = makeEmptyDungeonState()

    updateSeen(d, 1, [true, true, false, false, false])

    expect(d.seen).toEqual([
        [0, 0, 0, 0, 0],
    ])

    updateSeen(d, 2, [true, true, false, false, false])

    expect(d.seen).toEqual([
        [0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [-1, 0, 0, 0, 0],
        [0, 1, 0, 0, 0],
        [0, -1, 0, 0, 0],
    ])

    const d2 = makeEmptyDungeonState()

    updateSeen(d2, 3, [true, true, false, false, false])

    expect(d2.seen).toEqual([
        [0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [2, 0, 0, 0, 0],
        [1, 1, 0, 0, 0],
        [1, -1, 0, 0, 0],
    
        [-1, 0, 0, 0, 0],
        [-2, 0, 0, 0, 0],
        [-1, 1, 0, 0, 0],
        [-1, -1, 0, 0, 0],
    
        [0, 1, 0, 0, 0],
        [0, 2, 0, 0, 0],
        
        [0, -1, 0, 0, 0],
        [0, -2, 0, 0, 0],
    ])


    updateSeen(d, 3, [true, true, false, false, false])

    expect(d.seen).toEqual([
        [0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0],
        [-1, 0, 0, 0, 0],
        [0, 1, 0, 0, 0],
        [0, -1, 0, 0, 0],
        
        [2, 0, 0, 0, 0],
        [1, 1, 0, 0, 0],
        [1, -1, 0, 0, 0],

        [-2, 0, 0, 0, 0],
        [-1, 1, 0, 0, 0],
        [-1, -1, 0, 0, 0],

        [0, 2, 0, 0, 0],

        [0, -2, 0, 0, 0],
    ])

})