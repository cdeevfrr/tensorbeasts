import PartyPlanC from "@/components/PartyPlanC";
import { PartyPlan } from "@/Game/Beasts/PartyPlan";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Beast } from "@/Game/Beasts/Beast";
import { CoreAttackSkills } from "@/Game/SkillDex/Core/CoreAttack/CoreAttackList";
import { v4 as uuidv4 } from 'uuid';
import { SupportSkills } from "@/Game/SkillDex/Support/SupportSkillList";


const partiesKey = 'parties';

export default function Parties() {
  const [parties, setParties] = useState<Array<PartyPlan>>([{
    core: [null, null],
    support: [null, null],
    vanguard: [null, null],
  }])
  useEffect(() => {
    AsyncStorage.getItem(partiesKey).then((result) => {
      if (result){
        setParties(JSON.parse(result))
      }
    });
  }, []);

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
            box={fakeBox}
          />
        <Button
          title="Save"
          onPress={async () => {
            await AsyncStorage.setItem(
              partiesKey,
              JSON.stringify(parties)
            )
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

const fakeBox: Array<Beast> = [{
  uuid: uuidv4(),
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

},
{
  uuid: uuidv4(),
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
}, {
  uuid: uuidv4(),
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