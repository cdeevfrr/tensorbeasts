import PartyPlanC from "@/components/PartyPlanC";
import { PartyPlan } from "@/Game/Beasts/PartyPlan";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Beast } from "@/Game/Beasts/Beast";
import { CoreAttackSkills } from "@/Game/SkillDex/Core/CoreAttack/CoreAttackList";
import { SupportSkills } from "@/Game/SkillDex/Support/SupportSkillList";
import { boxKey, partiesKey } from "@/constants/GameConstants";
import { router, useFocusEffect } from "expo-router";
import React from "react";

export default function Parties({
  initialParties,
  initialBox,
}:{
  initialParties?: Array<PartyPlan>,
  initialBox?: Array<Beast>,
}) {
  const [parties, setParties] = useState<Array<PartyPlan>>(initialParties || [{
    core: [null, null],
    support: [null, null],
    vanguard: [null, null],
  }])

  const [box, setBox] = useState<Array<Beast>>(initialBox || [])

  useFocusEffect(React.useCallback(() => {
    let isActive = true
    const cancelFunction = () => {
      isActive = false
    }

    const callback = async () => {
      if (!initialParties){
        const partiesString = await AsyncStorage.getItem(partiesKey)

        if (partiesString && isActive){
          setParties(JSON.parse(partiesString))
        }
      }

      if (!initialBox){
        const boxString = await AsyncStorage.getItem(boxKey)
  
        if (!boxString){
          // TODO: Move fakeBox to some kind if "init" phase of the game
          // that only triggers if box isn't found.
          await AsyncStorage.setItem(boxKey, JSON.stringify(fakeBox))
          if (isActive){
            setBox(fakeBox)
          }
        } else {
          if (isActive){
            setBox(JSON.parse(boxString))
          }
        }
      }
    }

    callback().catch(console.error)

    return cancelFunction
  }, []));

  const [selectedParty, setSelectedParty] = useState(0)

  // TODO:
  // On leave editing a party, save the party to storage.
  // Let players add parties.
  // Let players choose beasts from their storage to add to the currently selected party
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Parties screen</Text>
        <Text style={styles.text}>Editing party {selectedParty + 1}</Text>
        <PartyPlanC 
            party={parties[selectedParty]}
            setParty={(partyPlan) => {
              parties[selectedParty] = partyPlan
              setParties([...parties])
            }}
            box={box}
          />
        <Button
          title="Save"
          onPress={async () => {
            await AsyncStorage.setItem(
              partiesKey,
              JSON.stringify(parties)
            )
            router.navigate('/')
          }}
        ></Button>
      </View>
    );
  }

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
},
text: {
    color: '#fff',
},
});

const fakeBox: Array<Beast> = [
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