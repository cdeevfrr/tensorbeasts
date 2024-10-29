
// This function file includes functions used to create data if not found,
// almost always run once on initial load of the app. 

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Beast } from "./Beasts/Beast";
import { CoreAttackSkills } from "./SkillDex/Core/CoreAttack/CoreAttackList";
import { SupportSkills } from "./SkillDex/Support/SupportSkillList";
import { boxKey } from "@/constants/GameConstants";

// All functions should operate very carefully to ensure you don't delete data
// if there's already data at that spot.

export async function cleanStartup() {
    await createBox()
    // clearDungeonState()
    // clearBattleState()
    // clearPartyState()
}

export async function createBox() {
    const currentBox = await AsyncStorage.getItem(boxKey)
    if (!currentBox){
        AsyncStorage.setItem(boxKey, JSON.stringify(initialBox))
    }
    else {
        throw new Error("Cannot wipe box - found that it already had contents.")
    }

    return JSON.parse(JSON.stringify(initialBox))
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
      coreMatchSkill: {
        fixME: 1
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
        ...SupportSkills.SingleBlockDestroy.factory({}),
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
          ...SupportSkills.SingleBlockDestroy.factory({}),
          type: "SingleBlockDestroy"
        },
        {
          ...SupportSkills.MatchColorBlockDestroy.factory({}),
          type: "MatchColorBlockDestroy"
        }],
    }
    ]