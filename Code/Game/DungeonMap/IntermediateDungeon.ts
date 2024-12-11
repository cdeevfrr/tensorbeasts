import { Beast } from "../Beasts/Beast"
import { Location } from "../Battle/Board"
import { DungeonMap, generateBeast } from "./DungeonMap"
import { boxTileImage } from "./Images"

export const intermediateDungeon : DungeonMap = {
    getBattleAt: getBattleAt,
    getTileAt: () => {return {
        image: () => boxTileImage({background: 'brown', foreground: 'red'}), 
        walkable: true, 
        opaque: false
    }},    id: 'intermediateDungeon',
}

function getBattleAt({location}:{location: Location}): Array<Beast>{
    // x direction changes level.
    // y direction changes gains.
    // TODO: z direction changes rarity/skills
    // Pseudolevel still goes up with distance from 0,0

    let y = location[1]
    if (y > 10){
        y = 10
    }
    if (y < -10){
        y = -10
    }

    let x = location[0]
    if (x > 10){
        x = 10
    }
    if (x < -5){
        x = -5
    }


    // 1, 0, -1 -> yLean = 1
    // 2 -> yLean 2
    // -2 -> yLean 1/2
    // 10 -> 10
    // -10 -> 1/10
    let yLean = y
    if (yLean == 0){
        yLean = 1
    }
    if (yLean < 0){
        yLean = 1/-yLean
    }


    return [generateBeast({
        pseudolevel: location.reduce((a, b) => a+b, 0),
        level: 6 + x,
        atkGrowthLean: yLean,
        defGrowthLean: yLean,
        hpGrowthLean: yLean,
    }) ]
}