import { Beast } from "@/Game/Beasts/Beast"
import { beginnerDungeon } from "@/Game/DungeonMap/BeginnerDungeon"

// Wish this mock wasn't needed.
// Got errors from JUST jest.
// https://stackoverflow.com/questions/73203367/jest-syntaxerror-unexpected-token-export-with-uuid-library
jest.mock('uuid', () => {
    return {
      v4: jest.fn(() => 1)
    }
})

it('Creates a valid beast at multiple locations', () => {
    const beasts = beginnerDungeon.getBattleAt({location: [-2, 0,0,0,0]})
    assertValidBeasts(beasts)
})

function assertValidBeasts(beasts: Array<Beast>){
  for (const beast of beasts){
    expect(beast.baseAttack).not.toBeFalsy()
    expect(beast.baseDefense).not.toBeFalsy()
    expect(beast.baseHP).not.toBeFalsy()
    expect(beast.level).not.toBeFalsy()
    expect(beast.species).not.toBeFalsy()
    expect(beast.uuid).toBe(1)

  }
}