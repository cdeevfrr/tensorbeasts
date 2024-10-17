import { Beast } from "../Beasts/Beast";
import { Location } from "../Battle/Board";
import { DungeonMap, generateBeast } from "./DungeonMap";


export const beginnerDungeon : DungeonMap = {
    getBattleAt: getBattleAt
}

function getBattleAt({location}:{location: Location}): Array<Beast>{
    return [generateBeast({
        pseudolevel: location.reduce((a, b) => a+b, 0),
        level: 5
    }) ]
}