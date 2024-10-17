import { accessLocation, Board, cloneBoard } from "./Board"
import { DestroyEvent } from "./DestroyEvent"
import { locationsIter, Location, setLocation } from "./Board"
import { Block } from "./Block"
import { BeastState } from "./BeastState"
import { SupportSkill } from "../SkillDex/Support/SupportSkill"
import { SupportSkills } from "../SkillDex/Support/SupportSkillList"
import { randInt } from "../util"
import { BeastLocation } from "../Beasts/BeastLocation"

export interface BattleState {
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

// fill in all nulls in the battle's board.
// This function must live here because we need things like the battle current effects to decide
// what new blocks to generate.
export function fallOne(battleState: BattleState, clone: boolean = true){
    const newBattleState: BattleState = clone? JSON.parse(JSON.stringify(battleState)) : battleState

    // Gravity goes in the x direction, x=0 is the bottom of the screen & the bottom of gravity.

    const newBoard = newBattleState.board

    // For each y, z, a, b coordinate:
    //   check at x=0, x=1, x=2, and so on.
    //   If null, grab from the one above (if exists).
    //   If null and at top, generate one. 
    // This relies on the fact that locationsIter presents locations with lower x value first.
    for (const [x, y, z, a, b] of locationsIter(battleState.board)){
        // TODO: Clean this up.
        // Boards should be a full on class, exposing a swap function.
        // Heck, we should probably even expose a 'Fall' that just takes a 'generateBlock' function
        // as an arg.
        if (!accessLocation([x,y,z,a,b], newBoard)) {
            const above = accessLocation([x+1,y,z,a,b], newBoard) 
            if (above == undefined){
                newBoard.blocks[x][y][z][a][b] = generateBlock(battleState)
            } else {
                newBoard.blocks[x][y][z][a][b] = above
                newBoard.blocks[x+1][y][z][a][b] = null
            }
        }
    }

    newBattleState.board = newBoard
    return newBattleState
}

export function fall(battleState: BattleState, clone = true){
    // TODO:
    // While fallOne causes changes, keep falling. 
    return fallOne(battleState, clone)
}

/**
 * Destroy the blocks at the selected locations; fall afterwards.
 * 
 * Clone is used to skip the expensive clone state if you've already cloned the battleState this render cycle.
 * It has a sensible default if you aren't sure.
 * @param battleState 
 * @param locations 
 * @param clone 
 * @returns 
 */
export function destroyBlocks(battleState: BattleState, locations: Array<Location>, clone = true): BattleState{
    const newBattleState: BattleState = clone? JSON.parse(JSON.stringify(battleState)) : battleState

    const destroyEvent: DestroyEvent = {
        blocksDestroyed: cloneBoard(battleState.board)
    }
    const locationsSet = new Set(locations.map(location => JSON.stringify(location)))
    for (const location of locationsIter(destroyEvent.blocksDestroyed)){
        if (!locationsSet.has(JSON.stringify(location))) {
            setLocation(location, destroyEvent.blocksDestroyed, null)
        }
    }


    newBattleState.stack.push(destroyEvent)

    for (const location of locations){
        setLocation(location, newBattleState.board, null)
    }

    return fall(newBattleState, false)
}

export function generateBlock(battleState: BattleState): Block{
    return {
        color: randInt({min: 1, maxExclusive: 6}),
        shape: randInt({min: 1, maxExclusive: 6}),
        number: randInt({min: 1, maxExclusive: 6}),
    }
}

export function useSkill(battleState: BattleState, beast: BeastState, skill: SupportSkill): BattleState{
    return SupportSkills[skill.type].execute(skill, battleState, beast, {})
}

// Note: This function intentionally tries to find _something_ to give you, 
// even if the location isn't quite right.
// That way attacks will still do something even if the target was killed.
export function beastAt({
    d, 
    location
}:{
    d: BattleState, 
    location: BeastLocation
}): BeastState | undefined{
    const array = d[location.array]

    if (array == undefined){
        return undefined
    }

    if (location.index > array.length - 1){
        return array[array.length - 1]
    }

    if (location.index < 0){
        return array[0]
    }

    return array[location.index]
}

export function processBeastAttack({
    beastLocation,
    d
}: {
    d: BattleState,
    beastLocation: BeastLocation
}): BattleState {
    let attacker = beastAt({d, location: beastLocation})
    if (!attacker){
        return d
    }
    const attacks = attacker.pendingAttacks;

    if (!attacks){
        return d
    }
    if (attacks.length == 0){
        return d
    }

    const newState: BattleState = JSON.parse(JSON.stringify(d))

    attacker = beastAt({d: newState, location: beastLocation}) as BeastState
    attacker.pendingAttacks = []

    for (const attack of attacks){
        const target = beastAt({d: newState, location: attack.target})
        if (!target){
            continue
        }
        const preDefDamage = attacker.beast.baseAttack * attack.power
        // TODO: Modify power based on color/number/shape of attack & target
        const def = target.beast.baseDefense
        console.log(attack.power)
        console.log(preDefDamage)
        console.log(def)
        const damage = preDefDamage * Math.pow(3, -1 + (preDefDamage / def - 1)/2)

        console.log("Dealing " + damage  + "damage")
        target.currentHP -= damage

        // Check for dead beasts
        if (target.currentHP < 0){
            // Because beastAt may cleverly 'find' a beast, 
            // to eliminate something, we have to lookup its true index.
            const trueIndex = newState[attack.target.array].indexOf(target)
            newState[attack.target.array].splice(trueIndex, 1)
        }
    } 
    return newState
}
