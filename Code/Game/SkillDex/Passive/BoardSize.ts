// The board size passive skill increases a dimension somewhere.

import { addColumnToDimension, boardDimension, removeColumnFromDimension } from "@/Game/Battle/Board";
import { PassiveSkill } from "./PassiveSkill";
import { PassiveBlueprint } from "./PassiveSkillBlueprint";
import { generateBlock } from "@/Game/Battle/BattleState";

export const BoardSize: PassiveBlueprint = {
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

        const typedDimension = dimension as keyof typeof texts
        const toAdd = quality > 3? 2 : 1
        return {
            name: "Add " + toAdd + " to the " + texts[typedDimension] +  " dimension.",
            dimension,
            toAdd,
        }
    },
    activate: (self, battleState, caller) => {
        if (!isBoardSizePassive(self)){
            throw new Error("Called on wrong type? This is the BoardSize function: " + self)
        }

        for (let i = 0; i < self.toAdd; i ++){
            battleState.board = addColumnToDimension(
                battleState.board, 
                self.dimension, 
                () => generateBlock(battleState))
        }
    },
    deactivate: (self, battleState, caller) => {
        if (!isBoardSizePassive(self)){
            throw new Error("Called on wrong type? This is the BoardSize function: " + self)
        }

        for (let i = 0; i < self.toAdd; i ++){
            battleState.board = removeColumnFromDimension(
                battleState.board, 
                self.dimension)
        }
    }
}

type BoardSize = PassiveSkill & {
    dimension: boardDimension,
    toAdd: number,
}

export function isBoardSizePassive(p: PassiveSkill): p is BoardSize {
    return p.type === "BoardSize"
}

const texts = {
    0: "first",
    1: "second",
    2: "third",
    3: "fourth",
    4: "fifth",
}