import { Beast } from "../Beasts/Beast";
import { Location } from "../Battle/Board";
import { DungeonMap, generateBeast } from "./DungeonMap";
import { randChoice, randInt } from "../util";
import { SupportSkills } from "../SkillDex/Support/SupportSkillList";
import { CoreAttackSkills } from "../SkillDex/Core/CoreAttack/CoreAttackList";
import { PassiveSkill } from "../SkillDex/Passive/PassiveSkill";
import { BoardSize } from "../SkillDex/Passive/Dex/BoardSize";
import { boxTileImage } from "./Images";
import { Tile } from "./Tile";
import { v4 } from "uuid";


export const beginnerDungeon : DungeonMap = {
    getBattleAt: getBattleAt,
    getTileAt: getTileAt,
    id: 'beginnerDungeon',
}

function getBattleAt({location}:{location: Location}): Array<Beast>{
    const sum = location.reduce((a, b) => a+b, 0)
    const numToGenerate = Math.max(1, 
        Math.floor(sum / 4) + randChoice({
            array: [0, 1, 2], 
            probabilities: [5, 1, 1]
        })
    )
    const pseudolevel = Math.max(1, sum)

    const result = []
    for (let i = 0; i < numToGenerate; i++){
        console.log("Making a beast")
        const nextBeast = generateBeast({
            pseudolevel,
            level: 5
        })

        if (0 <= pseudolevel && pseudolevel <= 10){
            // Create support skills
            const supportSkillType = randChoice({array: l10SupportSkills, probabilities: l10SupportProbs})
            if (supportSkillType){
                const generatedSupportSkill = SupportSkills[supportSkillType].factory({
                    quality: Math.max(1, 
                        pseudolevel + randChoice({
                            array: [-1, 0, 1],
                            probabilities: [10, 80, 10]
                        }
                    ))
                })
                nextBeast.supportSkills = [{
                    ...generatedSupportSkill,
                    id: v4(),
                    type: supportSkillType,
                }]
            }
            
            // Create core attack skills
            const coreAttackSkillType = randChoice({array: l10CoreAtkSkills, probabilities: l10CoreAtkProbs})
            if (coreAttackSkillType){
                const generatedCoreAttackSkill = CoreAttackSkills[coreAttackSkillType].factory({
                    quality: Math.floor(pseudolevel / 3)
                })
                nextBeast.coreAttackSkill = {
                    ...generatedCoreAttackSkill,
                    type: coreAttackSkillType,
                }
            }
        }

        // Create passive skills (just board size for now)
        if (5 <= pseudolevel) {
            const passiveSkillCount = randChoice({
                array: [0, 1, 2, 3], 
                probabilities: [1, (pseudolevel - 2), (pseudolevel - 5), (pseudolevel - 5) / 2]
            })
            for (let i = 0; i < passiveSkillCount; i ++){
                // For now, all passive skills are board size on this map,.
                const dimension = randChoice({
                    array: [0, 1, 2, 3, 4],
                    probabilities: [10, 30, 20, 20, 20]
                })
                // Hack to allow us to put dimension in this function call.
                // Typescript complains otherwise.
                const args = {
                    quality: pseudolevel - 5,
                    dimension
                }
                const skill: PassiveSkill = {
                    ...BoardSize.factory(args),
                    type: "BoardSize"
                }

                if (!nextBeast.passiveSkills){
                    nextBeast.passiveSkills = []
                }
                nextBeast.passiveSkills.push(skill)
            }
        }

        result.push(nextBeast)
    }

    return result
}

function getTileAt({ location }: { location: Location }): Tile {
    const colors1 = { background: 'brown', foreground: 'red' }
    const colors2 = { background: 'yellow', foreground: 'yellow' }
    const colors3 = { background: 'green', foreground: 'green' }

    let color = colors1

    const sum = location.reduce((a, b) => a+b)

    if ( location[0]%5 === 0 && sum % 6 === 0){
        color = colors2
    } else if ((location[0]%5 === 0 || location[0]%5 === 1) 
        && (sum % 6 === 0 || sum % 6 === 1)){
        color = colors3
    }

    return {
        image: () => boxTileImage(color),
        walkable: true,
        opaque: false
    }
}
 
const l10SupportSkills: Array<keyof typeof SupportSkills | null> = [
    null,
    "MatchColorBlockDestroy",
    "SingleBlockDestroy"
]
const l10SupportProbs: Array<number> = [
    60,
    10,
    30,
]

const l10CoreAtkSkills: Array<keyof typeof CoreAttackSkills | null> = [
    null,
    "CountAttack",
    "MatchColorAttack",
]
const l10CoreAtkProbs: Array<number> = [
    30,
    35,
    35,
]