import { generateBeast } from "@/Game/DungeonMap/DungeonMap"

// Wish this mock wasn't needed.
// Got errors from JUST jest.
// https://stackoverflow.com/questions/73203367/jest-syntaxerror-unexpected-token-export-with-uuid-library
jest.mock('uuid', () => {
    return {
      v4: jest.fn(() => 1)
    }
})

it('passes', () => {
    expect(true)
})

