
// This function file includes functions used to create data if not found,
// almost always run once on initial load of the app. 

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Beast } from "./Beasts/Beast";
import { CoreAttackSkills } from "./SkillDex/Core/CoreAttack/CoreAttackList";
import { SupportSkills } from "./SkillDex/Support/SupportSkillList";
import { boxKey, partiesKey } from "@/constants/GameConstants";
import { PartyPlan } from "./Beasts/PartyPlan";
import { PassiveSkill } from "./SkillDex/Passive/PassiveSkill";

// All functions should operate very carefully to ensure you don't delete data
// if there's already data at that spot.

export async function cleanStartup() {
    await createBox() // <- Also creates an initial party
    // clearDungeonState()
    // clearBattleState()
}

export async function createBox() {
    const currentBox = await AsyncStorage.getItem(boxKey)
    if (!currentBox){
        AsyncStorage.setItem(boxKey, JSON.stringify(initialBox))
    }
    else {
        throw new Error("Cannot wipe box - found that it already had contents.")
    }

    // Wipe parties without checking. They can always be recreated, and
    // we don't want someone keeping a non-existent beast around in a party.

    const result: Array<Beast> = JSON.parse(JSON.stringify(initialBox))

    const initialParty: PartyPlan = {
        vanguard: [null, null],
        core: [
          ...result.filter(beast => 
          beast.uuid === '9ef62d3d-64a1-4bab-83f5-fa0522acc9e5'),
          null
        ],
        support: [
          ...result.filter(beast => 
            beast.uuid === '736c475e-e3db-4ef6-aefe-ce245cfaa687' ),
          null
        ],
    }

    AsyncStorage.setItem(partiesKey, JSON.stringify([initialParty]))

    return result
}

const initialBox: Array<Beast> = [
    { uuid: '9ef62d3d-64a1-4bab-83f5-fa0522acc9e5',
      colors: [2],
      species: 2,
    
      baseAttack: 12,
      baseDefense: 1,
      baseHP: 100,
    
      growthDetails: {
    
        attackGain: 1,
        defenseGain: 1,
        hpGain: 1,
    
        experience: 100,
        growthRate: 1,
      },
      level: 1,
    
      supportSkills: [],
      coreGroupSkill: {
        name: "Continuous group manual",
        type: "ContinuousThree",
      },
      coreAttackSkill: {
        ...CoreAttackSkills.CountAttack.factory({ quality: 1 }),
        type: "CountAttack"
      }
    
    },{ uuid: 'e85b3be9-1d48-4709-b8eb-d354b51d79de',
      colors: [1],
      species: 1,
    
      baseAttack: 1,
      baseDefense: 1,
      baseHP: 100,
    
      growthDetails: {
    
        attackGain: 1,
        defenseGain: 1,
        hpGain: 1,
    
        experience: 100,
        growthRate: 1,
      },
      level: 1,
    
      supportSkills: [{
        ...SupportSkills.SingleBlockDestroy.factory({quality: 2}),
        type: "SingleBlockDestroy"
      }],
    },{ uuid: '736c475e-e3db-4ef6-aefe-ce245cfaa687',
      colors: [1],
      species: 1,
    
      baseAttack: 1,
      baseDefense: 1,
      baseHP: 100,
    
      growthDetails: {
    
        attackGain: 1,
        defenseGain: 1,
        hpGain: 1,
    
        experience: 100,
        growthRate: 1,
      },
    
      level: 1,
    
      supportSkills: [
        {
          ...SupportSkills.SingleBlockDestroy.factory({quality: 2}),
          type: "SingleBlockDestroy"
        },
        {
          ...SupportSkills.MatchColorBlockDestroy.factory({quality: 2}),
          type: "MatchColorBlockDestroy"
        }],
    }
  ]


// Used for developer testing only, there are buttons in the UI to add this beast to the current box.
export async function addCustomBeastToBox(){
  const currentBoxString = await AsyncStorage.getItem(boxKey)

  if(!currentBoxString){
    throw new Error("Tried to add custom beast to a box, but box isn't initialized yet!")
  }

  const currentBox: Array<Beast> = JSON.parse(currentBoxString)

  // Remove any duplicates of the custom beast
  // No clue what happens if two beasts have the same UUID.
  const filtered = currentBox.filter(x => x.uuid !== customBeast.uuid)
  
  filtered.push(customBeast)
  await AsyncStorage.setItem(boxKey, JSON.stringify(filtered))
}

const customBeast: Beast = { 
  uuid: 'ManuallyCreatedDeveloperBeast',
  colors: [2],
  species: 2,

  baseAttack: 10,
  baseDefense: 10,
  baseHP: 100,

  growthDetails: {

    attackGain: 1,
    defenseGain: 1,
    hpGain: 1,

    experience: 100,
    growthRate: 1,
  },

  level: 1,

  supportSkills: [],
  coreGroupSkill: {
    name: "Continuous group manual",
    type: 'ContinuousThree'
  },
  passiveSkills: [
    {
      name: "Custom boardSize skill",
      type: "BoardSize",
      toAdd: 1,
      dimension: 1,
    } as PassiveSkill,
    {
      name: "Custom boardSize skill 2",
      type: "BoardSize",
      toAdd: 1,
      dimension: 2,
    } as PassiveSkill,
    {
      name: "Custom boardSize skill 3",
      type: "BoardSize",
      toAdd: 1,
      dimension: 3,
    } as PassiveSkill,
    {
      name: "Custom boardSize skill 4",
      type: "BoardSize",
      toAdd: 1,
      dimension: 4,
    } as PassiveSkill,
  ]

}