import { Location } from "../Battle/Board";
import { Beast } from "../Beasts/Beast";
import { BoardSize } from "../SkillDex/Passive/Dex/BoardSize";
import { randChoice } from "../util";
import { DungeonMap, generateBeast } from "./DungeonMap";
import { boxTileImage } from "./Images";
import { Tile } from "./Tile";


/**
The expanding dungeon looks like this in 3d:
            6

           55
         555555
           55

            4
           333
        333333333
      2111111111112
        333333333
           333
            4

           77
         777777
           77

            8

With walls around everything.

Pseudolevels increase with number. 
You have to access the peak in one dimension to to get to the next dimension
(Eg, at spot 2, there are drops that give you a Y dimension. At spot 4, there are drops for a z dimension.)


To leave the double-cone, you have to reach the 4th dimension, which should make you travel in a trapezoidal path to escape
 (increase in 4th=a and increase in z; then hold a & z constant for a bit; travel in the x&y direction; then decrease z and a together again. )

 This gets you to the top of another double cone. More has not been decided on yet.
 */



export const expandingDungeon: DungeonMap = {
    id: 'expandingDungeon',
    getBattleAt: getBattleAt,
    getTileAt: getTileAt,
}

function getBattleAt({location}: {location: Location}) {
    return zones[determineZone(location)].getBattle()
} 

function getTileAt({location}: {location: Location}): Tile {
    return zones[determineZone(location)].getTile()
} 

function determineZone(location: Location): keyof typeof zones{
    const x = location[0]
    const y = location[1]
    const z = location[2]
    const a = location[3]
    const b = location[4]

    if (y === 0 && z === 0 && -10 < x && x < 10){
        return 'one'
    }
    if (y === 0 && z === 0 && (x === -10 || x === 10)){
        return 'two'
    }
    if ((z === 0 && y !== 0 && (x*x + y*y < 100) && y*y < 90) ){
        return 'three'
    }
    if (y*y === 100 && z === 0 && x === 0){
        return 'four'
    }
    return 'wall'
}

const zones = {
    wall: {
        getBattle: () => [],
        getTile: () => wallTile(),
    },
    one: {
        getBattle: () => {return [zone1Beast()]},
        getTile: () => {return zone1Tile()},
    },
    two: {
        getBattle: () => {return [zone2Beast()]},
        getTile: () => {return zone2Tile()},
    },
    three: {
        getBattle: () => {return [zone3Beast()]},
        getTile: () => {return zone3Tile()},
    },
    four: {
        getBattle: () => {return [zone4Beast()]},
        getTile: () => {return zone4Tile()},
    },
}

function wallTile(){
    return {
        image: () => boxTileImage({foreground: 'grey', background: 'black'}),
        opaque: true,
        walkable: false,
    }
}


function zone1Tile(): Tile{
    return {
        image: () => boxTileImage({foreground: '#009900', background: '#006600'}),
        opaque: false,
        walkable: true,
    }
}
function zone1Beast(): Beast{
    const pendingBeast = generateBeast({
        level: randChoice({
            array: [1, 2, 3],
            probabilities: [5, 2, 1]
        }),
        pseudolevel: randChoice({
            array: [1, 2, 3],
            probabilities: [5, 2, 1]
        }),
    })

    if (!pendingBeast.passiveSkills){
        pendingBeast.passiveSkills = []
    }

    const args = {quality: 1, dimension: 0}
    pendingBeast.passiveSkills.push(
        {
            ...BoardSize.factory(args),
            type: 'BoardSize'
        }
    )

    return pendingBeast
}

function zone2Tile(): Tile{
    return {
        image: () => boxTileImage({foreground: '#006600', background: '#009900'}),
        opaque: false,
        walkable: true,
    }
}
function zone2Beast(): Beast{
    const pseudolevel = randChoice({
        array: [2, 3, 4],
        probabilities: [5, 2, 1]
    })
    const pendingBeast = generateBeast({
        level: randChoice({
            array: [2, 3, 4],
            probabilities: [5, 2, 1]
        }),
        pseudolevel,
    })
    if (!pendingBeast.passiveSkills){
        pendingBeast.passiveSkills = []
    }

    const args = {quality: 1, dimension: 1}
    pendingBeast.passiveSkills.push(
        {
            ...BoardSize.factory(args),
            type: 'BoardSize'
        }
    )

    return pendingBeast
}

function zone3Tile(): Tile{
    return {
        image: () => boxTileImage({foreground: '#cc9900', background: '#806000'}),
        opaque: false,
        walkable: true,
    }
}
function zone3Beast(): Beast {
    const pseudolevel = randChoice({
        array: [3, 4, 5],
        probabilities: [5, 2, 1]
    })
    const pendingBeast = generateBeast({
        level: randChoice({
            array: [4, 5, 6],
            probabilities: [5, 2, 1]
        }),
        pseudolevel,
    })
    if (!pendingBeast.passiveSkills){
        pendingBeast.passiveSkills = []
    }

    const boardSizeArgs = {
        // quality of 4 or up means add 2 in that dimension.
        quality: pseudolevel - 1, 
        dimension: randChoice({array: [0, 1], probabilities: [1,1]})
    }
    pendingBeast.passiveSkills.push(
        {
            ...BoardSize.factory(boardSizeArgs),
            type: 'BoardSize'
        }
    )

    return pendingBeast
}

function zone4Tile(): Tile{
    return {
        image: () => boxTileImage({foreground: '#995c00', background: '#ff9900'}),
        opaque: false,
        walkable: true,
    }
}
function zone4Beast(): Beast{
    const pseudolevel = randChoice({
        array: [4, 5, 6],
        probabilities: [5, 2, 1]
    })
    const pendingBeast = generateBeast({
        level: randChoice({
            array: [4, 5, 6],
            probabilities: [5, 2, 1]
        }),
        pseudolevel,
    })
    if (!pendingBeast.passiveSkills){
        pendingBeast.passiveSkills = []
    }

    const boardSizeArgs1 = {
        // quality of 4 or up means add 2 in that dimension.
        quality: pseudolevel - 2, 
        dimension: randChoice({array: [0, 1], probabilities: [1,1]})
    }
    pendingBeast.passiveSkills.push(
        {
            ...BoardSize.factory(boardSizeArgs1),
            type: 'BoardSize'
        }
    )

    const boardSizeArgs2 = {
        // quality of 4 or up means add 2 in that dimension.
        quality: 1,
        dimension: 2,
    }
    pendingBeast.passiveSkills.push(
        {
            ...BoardSize.factory(boardSizeArgs2),
            type: 'BoardSize'
        }
    )

    return pendingBeast
}