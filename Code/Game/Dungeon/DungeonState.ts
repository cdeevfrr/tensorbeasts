import { accessLocation, Board, cloneBoard } from "./Board"
import { DestroyEvent } from "./DestroyEvent"
import { locationsIter, Location, setLocation } from "./Board"
import { Block } from "./Block"
import { BeastState } from "./BeastState"
import { SupportSkill } from "../SkillDex/Support/SupportSkill"
import { SupportSkills } from "../SkillDex/Support/SupportSkillList"
import { randInt } from "../util"

export interface DungeonState {
    // Vanguard beasts have effects like
    //  - if >2 combos, 9X attack
    //  - if >10 of color purple, 2.5X attack
    vanguard: Array<BeastState>
    // Core beasts have stack->attack effects like 
    //  - 'when attacking, count blocks destroyed. All beasts attack at that power' 
    //  - 'when attacking, check if color/number/shape destroyed. All beasts of that color/number/shape attack at 100%'
    //  - 'when attacking, if blocks destroyed > 1, all beasts attack at 100% power'
    // and match-criteria effects (once per attack cycle) like
    //     - a match is a continuous block of one color
    //     - a match is a row of three of the same number
    //     - a match is a 4D cube
    // Core beast effects are always based on majority - the majority of core beasts must have this effect for it to trigger.
    core: Array<BeastState> 
    // Support beasts have active effects, like
    //  - Destroy a fixed/selected block
    //  - move blocks for n seconds (like PAD style movement)
    //  - sort blocks
    //  - Destroy selected block if it matches this beast's color
    //  - Destroy all blocks of color ____
    //  - Replace all blocks like __ with __
    support: Array<BeastState>
    enemies: Array<BeastState>
    board: Board
    // effects: Array<Buff> // Things like 'increased defense for X turns', 'increased chance of yellow for 3 turns', 'increase all beast stats by 2.2X' from core beasts, similar.
    stack: Array<DestroyEvent>
}

// fill in all nulls in the dungeon's board.
// This function must live here because we need things like the dungeon current effects to decide
// what new blocks to generate.
export function fallOne(dungeonState: DungeonState, clone: boolean = true){
    const newDungeonState: DungeonState = clone? JSON.parse(JSON.stringify(dungeonState)) : dungeonState

    // Gravity goes in the x direction, x=0 is the bottom of the screen & the bottom of gravity.

    const newBoard = newDungeonState.board

    // For each y, z, a, b coordinate:
    //   check at x=0, x=1, x=2, and so on.
    //   If null, grab from the one above (if exists).
    //   If null and at top, generate one. 
    // This relies on the fact that locationsIter presents locations with lower x value first.
    for (const [x, y, z, a, b] of locationsIter(dungeonState.board)){
        // TODO: Clean this up.
        // Boards should be a full on class, exposing a swap function.
        // Heck, we should probably even expose a 'Fall' that just takes a 'generateBlock' function
        // as an arg.
        if (!accessLocation([x,y,z,a,b], newBoard)) {
            const above = accessLocation([x+1,y,z,a,b], newBoard) 
            if (above == undefined){
                newBoard.blocks[x][y][z][a][b] = generateBlock(dungeonState)
            } else {
                newBoard.blocks[x][y][z][a][b] = above
                newBoard.blocks[x+1][y][z][a][b] = null
            }
        }
    }

    newDungeonState.board = newBoard
    return newDungeonState
}

export function fall(dungeonState: DungeonState, clone = true){
    // TODO:
    // While fallOne causes changes, keep falling. 
    return fallOne(dungeonState, clone)
}

/**
 * Destroy the blocks at the selected locations; fall afterwards.
 * 
 * Clone is used to skip the expensive clone state if you've already cloned the dungeonState this render cycle.
 * It has a sensible default if you aren't sure.
 * @param dungeonState 
 * @param locations 
 * @param clone 
 * @returns 
 */
export function destroyBlocks(dungeonState: DungeonState, locations: Array<Location>, clone = true): DungeonState{
    const newDungeonState: DungeonState = clone? JSON.parse(JSON.stringify(dungeonState)) : dungeonState

    const destroyEvent: DestroyEvent = {
        blocksDestroyed: cloneBoard(dungeonState.board)
    }
    const locationsSet = new Set(locations.map(location => JSON.stringify(location)))
    for (const location of locationsIter(destroyEvent.blocksDestroyed)){
        if (!locationsSet.has(JSON.stringify(location))) {
            setLocation(location, destroyEvent.blocksDestroyed, null)
        }
    }


    newDungeonState.stack.push(destroyEvent)

    for (const location of locations){
        setLocation(location, newDungeonState.board, null)
    }

    return fall(newDungeonState, false)
}

export function generateBlock(dungeonState: DungeonState): Block{
    return {
        color: randInt({min: 1, maxExclusive: 6}),
        shape: randInt({min: 1, maxExclusive: 6}),
        number: randInt({min: 1, maxExclusive: 6}),
    }
}

export function useSkill(dungeonState: DungeonState, beast: BeastState, skill: SupportSkill): DungeonState{
    return SupportSkills[skill.type].execute(skill, dungeonState, beast, {})
}

