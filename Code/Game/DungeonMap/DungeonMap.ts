// Dungeon maps have details about particular features at x,y,z,a,b points, and 
// a way to generate battles if you're in a location without a feature.
// Dimensions of a dungeon will be inaccessable until you have a party that makes the board nD


import { maxColor, maxNumber, maxShape } from "@/constants/GameColors";
import { Beast, levelUp } from "../Beasts/Beast";
import { Location } from "../Battle/Board";
import { gaussianRandom, randChoice, randInt } from "../util";
import { CoreAttackSkills } from "../SkillDex/Core/CoreAttack/CoreAttackList";
import { SupportSkills } from "../SkillDex/Support/SupportSkillList";
import 'react-native-get-random-values'
import { v4 } from "uuid"
import { beginnerDungeon } from "./BeginnerDungeon";
import { intermediateDungeon } from "./IntermediateDungeon";
import { Tile } from "./Tile";

export interface DungeonMap {
    getBattleAt: ({location}: {location: Location}) => Array<Beast>,
    getTileAt: ({location}: {location: Location}) => Tile
    id: string, // Must be unique across dungeon maps. Used for loading from JSON.
}

/**
 * Helper function for maps to use to generate beasts with some reasonable defaults.
 * 
 * Maps are responsible for completely specifying the required parts of the
 * new beast before returning it to a battleState!
 * 
 * All the leans are numbers, baseline 1.0, that indicate 
 * how much better or worse this thing (HP, core skill) should be 
 * compared to baseline. A 3.0 is one pseudolevel up, for that thing.
 * 
 * Pseudolevel is the most important thing to get right in this function.
 * 
 * 
 * @param param0 
 */
export function generateBeast({
    rarity = 1,
    hpLean = 1,
    defLean = 1, 
    atkLean = 1,
    coreSkillLean,
    vanguardSkillLean,
    supportSkillLean,
    hpGrowthLean = 1,  
    atkGrowthLean = 1,
    defGrowthLean = 1,
    growthRate = 1,
    level,
    species,
    pseudolevel,
}: {
    rarity?: number,
    hpLean?: number,
    defLean?: number, 
    atkLean?: number,
    coreSkillLean?: number,
    vanguardSkillLean?: number,
    supportSkillLean?: number,
    // Directly multiplies hp gain (gaussian random)
    hpGrowthLean?: number,
    // Directly multiplies attack gain (gaussian random)
    atkGrowthLean?: number,
    // Directly multiplies def gain (gaussian random)
    defGrowthLean?: number,
    growthRate?: number, // directly scales with expected beast max level.
    level: number,
    species?: number, // TODO: Make this arg a probability distribution
    // Once I figure out probability dists for species:
    // Make probability dists for color/number/shape.
    pseudolevel: number,
}): Beast{
    // TODO If species not specified, pick it based on rarity

    const coreVal = Math.pow(3, pseudolevel - 1)

    // Make it at level 1
    let beast: Beast = {
        uuid: v4(),
        baseAttack: coreVal * (gaussianRandom(atkLean, .2)),
        baseDefense: coreVal * (gaussianRandom(defLean, .2)),
        baseHP: coreVal * (gaussianRandom(hpLean, .2)),
        level: 1,
        species: species || 1,
        supportSkills: [],

        // You can expect to get half of your gain per level (rand number between 0 and n has expected value n/2)
        // We want 100 levels to be about equal to 2-3 pseudo levels (though levels are unbounded, it gets too hard to level up past that.)
        // So eg atk can go up about 15 times over the course of 100 levels; 
        // atkGain ~ (baseAttack * 15) / 100 * 2
        // In reality, both atkGain & baseAttack are calculated in terms of pseudolevel,
        // not in terms of each other (so that you can make a beast with low initial atk but 
        // great atk gain).
        growthDetails: {
            attackGain: coreVal / 100 * 15 * 2 * (gaussianRandom(atkGrowthLean, .2)),
            defenseGain: coreVal / 100 * 15 * 2 * (gaussianRandom(defGrowthLean, .2)),
            hpGain: coreVal / 100 * 15 * 2 * (gaussianRandom(hpGrowthLean, .2)),
            experience: 0,
            growthRate: growthRate
        },
        colors: [],
        numbers: []
    }
    // All single-color beasts for now.
    const colorCount = 1
    for (let i = 0; i < colorCount; i++){
        // Quick hack to give 1/2 of all beasts a color.
        const color = randInt({min: -maxColor, maxExclusive: maxColor + 1})
        if (color > 0){
            beast.colors?.push(color)
        }
    }
    // All single-number beasts for now.
    const numberCount = 1
    for (let i = 0; i < numberCount; i++){
        // Quick hack to give 1/2 of all beasts a color.
        const number = randInt({min: -maxNumber, maxExclusive: maxNumber + 1})
        if (number > 0){
            beast.numbers?.push(number)
        }
    }

    // All single-shape beasts for now.
    const shapeCount = 1
    for (let i = 0; i < shapeCount; i++){
        // Quick hack to give 1/2 of all beasts a color.
        const shape = randInt({min: -maxShape, maxExclusive: maxShape + 1})
        if (shape > 0){
            beast.shapes?.push(shape)
        }
    }

    // Vanguard skills

    // Support skills
    if (Math.random() * (supportSkillLean || 1) > .8){ // 1 in 5 chance normally.

        const allowedSkillTypes = (Object.keys(SupportSkills) as Array<keyof typeof SupportSkills>)
        .filter(skillType => {
            SupportSkills[skillType].psuedolevels.includes(pseudolevel)
        })

        if (allowedSkillTypes.length != 0){
            const probabilities = allowedSkillTypes.map(skillType => {
                return SupportSkills[skillType].commonality
            })

            const skillType = randChoice({
                array: allowedSkillTypes,
                probabilities: probabilities
            }) as keyof typeof SupportSkills
            beast.supportSkills.push({
                ...SupportSkills[skillType].factory({quality: 1}),
                type: skillType,
            })
        }
    }

    // Core skills
    // TODO: Make the skill & the quality autoGenerated based on coreSkillLean. 
    // See how to do it with SupportSkill above.
    if (Math.random() * (coreSkillLean || 1) > .8){
        beast.coreAttackSkill = {
            ...CoreAttackSkills.CountAttack.factory({quality: 1}),
            type: "CountAttack"
        }
    }


    while (beast.level < (level || 1)){
        beast = levelUp({beast})
    }
    return beast
}

export function findMap({
    id,
}: {
    id: string
}) {
    // For some reason, putting this const outside this function causes beginner dungeon
    // to have value 'undefined'. Cannot for the life of me understand why.
    const maps123: Record<string, DungeonMap> = {
        'beginnerDungeon': beginnerDungeon,
        'intermediateDungeon': intermediateDungeon,
    }
    
    if (id in maps123){
        return maps123[id]
    }
    else {
        return maps123['beginnerDungeon']
    }
}