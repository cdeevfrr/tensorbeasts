import { v4 } from "uuid"
import { Beast, calcExpReward, calculateDrop, expForNextLevel, levelUp } from "../Beasts/Beast"
import { beastAt, Party } from "../Dungeon/Party"
import { CoreAttackSkills } from "../SkillDex/Core/CoreAttack/CoreAttackList"
import { SupportSkill } from "../SkillDex/Support/SupportSkill"
import { SupportSkills } from "../SkillDex/Support/SupportSkillList"
import { randInt } from "../util"
import { BeastState } from "./BeastState"
import { Block } from "./Block"
import { accessLocation, Board, cloneBoard, Location, locationsIter, setLocation, fall as boardFall } from "./Board"
import { DestroyEvent } from "./DestroyEvent"
import { calculateAttack, createPowerSpread } from "./PowerSpread"
import { Target } from "./Target"

export interface BattleState {
    playerParty: Party
    enemyParty: Party
    board: Board
    // effects: Array<Buff> // Things like 'increased defense for X turns', 'increased chance of yellow for 3 turns', 'increase all beast stats by 2.2X' from core beasts, similar.
    stack: Array<DestroyEvent>,
    beastDrops?: Array<Beast>,
    expReward?: number,
    // The beast whos core grouping skill is CURRENTLY active, and should 
    // cause grouping to occur without any user input.
    // Undefined initially, and is set when the user clicks 'attack' thru 
    // to when they click 'do it'.
    groupingBeast?: Beast,

    // Indicates that the user selected a skill, and this skill is waiting 
    // for the user to choose a block before continuing.
    // If non empty, set block onClick to be `callSkill(theIndicatedSkill, block)` 
    processingSkill?: {
        beastUUID: string,
        skillNum: number
    }
}

export function fall(battleState: BattleState, clone: boolean = true){
    const newBoard = boardFall({
        board: battleState.board,
        clone: true,
        generateBlock: () => generateBlock(battleState),
    })
    return {
        ...battleState,
        board: newBoard
    }
}

export function addGroupingBeast(battleState: BattleState, groupingBeast: Beast) {
    const newState = {
        ...battleState,
        groupingBeast
    }

    recalcuateBeastDamage(newState)

    return newState
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
export function destroyBlocks({
    battleState,
    locations,
    clone = true,
    shouldFall = true,
}:{
    battleState: BattleState, 
    locations: Array<Location>, 
    clone?: boolean,
    shouldFall?: boolean
}): BattleState {
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

    recalcuateBeastDamage(newBattleState)

    if (shouldFall){
        return fall(newBattleState, false)
    } else {
        return newBattleState
    }
}

// Since this statefully modifies battleState, don't export. Only call it if you've
// already cloned battleState.
function recalcuateBeastDamage(battleState: BattleState){
    let powerSpread = createPowerSpread({matches: [], powers: []})
    if (battleState.groupingBeast && battleState.groupingBeast.coreAttackSkill) {
        powerSpread = CoreAttackSkills[
            battleState.groupingBeast.coreAttackSkill.type
        ].process({
            self: battleState.groupingBeast.coreAttackSkill,
            stack: battleState.stack
        })
    }
    
      // Player calculation
      for (const array of [
        battleState.playerParty.vanguard,
        battleState.playerParty.core,
        battleState.playerParty.support,
      ]){
        for (const beast of array){
          beast.pendingAttacks = []
          const powers = calculateAttack({
            powerSpread,
            beast: beast.beast
          })
          for (const power of powers){
            beast.pendingAttacks.push({
              target: {
                party: 'enemyParty',
                partylocation: {
                  array: 'vanguard',
                  index: 0
                }
              },
              ...power
            })
          }
        }
      }
    
      // Enemy calculation (should be consolidated with player calculation.)
      for (const array of [
        battleState.enemyParty.vanguard,
        battleState.enemyParty.core,
        battleState.enemyParty.support,
      ]){
        for (const beast of array){
          beast.pendingAttacks = []
          const powers = calculateAttack({
            powerSpread,
            beast: beast.beast
          })
          for (const power of powers){
            beast.pendingAttacks.push({
              target: {
                party: 'playerParty',
                partylocation: {
                  array: 'vanguard',
                  index: 0
                }
              },
              ...power
            })
          }
        }
      }
}

export function generateBlock(battleState: BattleState): Block{
    // TODO: use gameConstants.maxColors, maxNumbers, ... here.
    return {
        color: randInt({min: 1, maxExclusive: 6}),
        shape: randInt({min: 1, maxExclusive: 6}),
        number: randInt({min: 1, maxExclusive: 6}),
        id: v4()
    }
}

export function useSkill(battleState: BattleState, beast: BeastState, skill: SupportSkill): BattleState{
    const newState = SupportSkills[skill.type].execute({
        selfId: skill.id, 
        battleState, 
        caller: beast, 
        payload: skill.payload})
    const newBeast = findBeast(newState, beast)
    if (newBeast){
        newBeast.currentCharge -= skill.chargeRequirement
    }
    return newState
}

export function continueSkill(
    battleState: BattleState, 
    beast: BeastState | null, 
    skill: SupportSkill, 
    selected: Location,
) : BattleState {
    const blueprint = SupportSkills[skill.type]
    if(!beast || beast.currentHP <= 0 || !blueprint.continue){
        const result = {
            ...battleState
        }
        delete result.processingSkill
        return result
    }

    return blueprint.continue({
        selfId: skill.id,
        payload: skill.payload,
        battleState, 
        caller: beast, 
        selection: selected
    })
}

// Used when you cloned a battleState and want to find the new Beast JSON that
// has the same UUID as the one in the previous battleState.
export function findBeast(state: BattleState, beast: {beast: {uuid: string}}){
    for (const array of [
        state.playerParty.vanguard,
        state.playerParty.core,
        state.playerParty.support,
        state.enemyParty.vanguard,
        state.enemyParty.core,
        state.enemyParty.support,
    ]) {
        for (const otherBeast of array){
            if(otherBeast.beast.uuid == beast.beast.uuid){
                return otherBeast
            }
        }
    }
    return null
}

export function findBeastLocation(state: BattleState, uuid: string): Target | null{
    // Have to tell typescript that parties will only have these TWO values.
    const parties: Array<'playerParty' | 'enemyParty'> = ['playerParty', 'enemyParty']
    const partyArrays: Array<keyof Party> = ['vanguard', 'core', 'support']
    for (const party of parties ){
        for (const arrayName of partyArrays ){
            const array = state[party][arrayName]
            for (let index = 0; index < array.length; index ++){
                if (array[index].beast.uuid === uuid){
                    return {
                        party,
                        partylocation: {
                            array: arrayName,
                            index,
                        }
                    }
                }
            }
        }
    }
    return null
}

export function processBeastAttack({
    attacker,
    battleState,
}: {
    attacker: BeastState,
    battleState: BattleState,
}): BattleState {
    console.log("Processing beast attacks for " + attacker.beast.uuid)

    // collect 'attacks' & return early if needed.

    if (!attacker || attacker.currentHP <= 0){
        return battleState
    }

    const attacks = attacker.pendingAttacks;

    // Still have to clone even if attacks isn't present,
    // since we have to set the beast's 'hasAttackedthisTurn' to true.

    // Clone, then wipe the new pendingAttacks array.
    const newState: BattleState = JSON.parse(JSON.stringify(battleState))
    attacker = findBeast(
      newState,
      attacker   
    ) as BeastState // Not null since we just checked before cloning.
    attacker.pendingAttacks = []
    attacker.hasAttackedThisTurn = true
    // actually do the attacks

    for (const attack of attacks || []){
        const target = getTargetedBeast({
            b: newState, 
            t: attack.target,
            exact: false,
            living: true
        })

        // Should only happen after battle is over since exact=false
        // .... Better safe than sorry!
        if (!target){
            continue
        }

        const preDefDamage = attacker.beast.baseAttack * attack.power
        // TODO: Modify power based on color/number/shape of attack & target
        const def = target.beast.baseDefense
        
        const damage = preDefDamage * Math.pow(3, -1 + (preDefDamage / def - 1)/2)

        // TODO: Make this visible with an animation.
        console.log("Dealing " + damage  + "damage")

        target.currentHP -= damage

        // Check for dead beasts
        if (target.currentHP < 0){
            // Because getTargetedBeast may cleverly 'find' a beast, 
            // to remove a beast, we have to lookup its true index.
            const trueIndex = findBeastLocation(newState, target.beast.uuid)

            if (!trueIndex){
                throw new Error("Cannot find the beast that just died! "+
                    "Old state: " + JSON.stringify(battleState) +
                    "New state: " + JSON.stringify(newState))
            }

            // Remove the enemy (or target) from its list.
            // TODO: This won't work with revives. Might need to consider that later.
            newState[trueIndex.party][trueIndex.partylocation.array].splice(trueIndex.partylocation.index, 1)

            // Calculate rewards

            // TODO: Reward EXP to the beast that struck the final blow?

            if (!newState.expReward){
                newState.expReward = 0
            }
            newState.expReward += calcExpReward(target.beast)
            if (!newState.beastDrops){
                newState.beastDrops = []
            }
            // TODO: Calculate drop probability based on more stuff
            const dropProbability = .5
            if (Math.random() < dropProbability){
                newState.beastDrops.push(calculateDrop(target.beast))
            }
        }
    } 
    return newState
}

export function addCharge(b: BattleState, charge: number): BattleState{
    const newState: BattleState = JSON.parse(JSON.stringify(b))
    for (const array of [
        newState.enemyParty.vanguard,
        newState.enemyParty.core,
        newState.enemyParty.support,
        newState.playerParty.vanguard,
        newState.playerParty.core,
        newState.playerParty.support,
    ]) {
        for (const beast of array){
            beast.currentCharge += charge
            const maxCharge = beast.beast.supportSkills.map(skill => {
                return skill.chargeRequirement
            }).reduce((a, b) => Math.max(a, b), 0)
            beast.currentCharge = Math.min(beast.currentCharge, maxCharge)
            // TODO: Should enemies try to use any skills? 
        }
    }
    return newState
}

export function completed(b: BattleState){
    return won(b) || lost(b)
}

export function won(b: BattleState){
    return beastAt({
        party: b.enemyParty,
        location: {
            array: 'vanguard',
            index: 0
        },
        exact: false,
        living: true
    }) === undefined
}

export function lost(b: Pick<BattleState, "playerParty">){
    // Player loses when all their core beasts are dead.
    const livingCore = b.playerParty.core.find(b => {
        return b && b.currentHP >0
    })
    return livingCore === undefined
}

function getTargetedBeast({
    b, 
    t, 
    exact=false, 
    living=true
}: {
    b: BattleState, 
    t: Target,
    exact?: boolean,
    living?: boolean,
}){
    return beastAt({
        location: {
            ...t.partylocation
        },
        party: b[t.party],
        exact,
        living,
    })
}

export function findNextAttacker(battleState: BattleState){
    for(const array of [
        battleState.playerParty.vanguard,
        battleState.enemyParty.vanguard,
        battleState.playerParty.core,
        battleState.playerParty.support,
        battleState.enemyParty.core,
        battleState.enemyParty.support
    ]) {
        for (const beast of array){
            if (beast.hasAttackedThisTurn === false){
                return beast
            }
        }
    }
    return null
}


/**
 * Award the current expReward to all alive player beasts;
 * return the new battle state.
 * 
 * Note that other functions must then save the updated beast data to 
 * long term storage (both box data & current dungeon run data)
 * @param battleState 
 */
export function rewardExp(battleState: BattleState) {
    const newBattleState = JSON.parse(JSON.stringify(battleState)) as BattleState
    for (const array of [
        newBattleState.playerParty.vanguard,
        newBattleState.playerParty.core,
        newBattleState.playerParty.support
    ]) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].currentHP > 0) {
                if (!array[i].beast.growthDetails) {
                    throw new Error("Beasts in the box should have growth details.")
                }

                // TODO: Get rid of the !.experience here. Need to rejigger types to fix this.
                array[i].beast.growthDetails!.experience += newBattleState.expReward || 0
                while ((array[i].beast.growthDetails!.experience || 0) > expForNextLevel({ beast: array[i].beast })) {
                    console.log(
                        "Leveling up " + array[i].beast.uuid 
                        + "; current exp " + array[i].beast.growthDetails!.experience
                        + "; needed exp " + expForNextLevel({ beast: array[i].beast }))
                    const newBaseBeast = levelUp({ beast: array[i].beast })
                    const hpIncrease = newBaseBeast.baseHP - array[i].beast.baseHP
                    array[i].beast = newBaseBeast
                    array[i].currentHP += hpIncrease
                }
            }
        }
    }
    return newBattleState
}
