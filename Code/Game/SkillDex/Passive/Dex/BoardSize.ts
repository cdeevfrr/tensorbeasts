// The board size passive skill increases a dimension somewhere.

import { addColumnToDimension, boardDimension, removeColumnFromDimension } from "@/Game/Battle/Board";
import { PassiveBlueprint } from "../PassiveSkillBlueprint";
import { generateBlock } from "@/Game/Battle/BattleState";
import { PassiveSkill } from "../PassiveSkill";

type factoryArg = {
    quality: number, 
    dimension?: number
}

type payloadType = {
    dimension: boardDimension,
    toAdd: number,
}

export const BoardSize: PassiveBlueprint<factoryArg, payloadType> = {
    factory: ({
        quality, 
        dimension = 1,
    }: {
        quality: number, 
        dimension?: number
    },) => {
        if (! (dimension in [0,1,2,3,4])){
            throw new Error ("Cannot make boardSize passive skill with invalid dimension " + dimension)
        }

        const typedDimension = dimension as boardDimension
        const toAdd = quality > 3? 2 : 1
        return {
            name: "Add " + toAdd + " to the " + texts[typedDimension] +  " dimension.",
            payload: {
                dimension: typedDimension,
                toAdd,
            }
        }
    },
    activate: (payload, battleState, caller) => {
        for (let i = 0; i < payload.toAdd; i ++){
            battleState.board = addColumnToDimension(
                battleState.board, 
                payload.dimension, 
                () => generateBlock(battleState))
        }
    },
    deactivate: (payload, battleState, caller) => {
        for (let i = 0; i < payload.toAdd; i ++){
            battleState.board = removeColumnFromDimension(
                battleState.board, 
                payload.dimension)
        }
    }
}

const texts = {
    0: "first",
    1: "second",
    2: "third",
    3: "fourth",
    4: "fifth",
}

// isBoardSizePassive is used in particular because unlike most passive skills which can just
// activate/deactivate in battle, the board size passive also affects dungeon rendering and
// movement. Other passive skills shouldn't need this function.
export function isBoardSizePassive(p: PassiveSkill): p is PassiveSkill & {payload: payloadType} {
    return p.type === "BoardSize"
}