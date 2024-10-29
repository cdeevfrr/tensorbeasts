import PartyPlanC from "@/components/PartyPlanC";
import { PartyPlan } from "@/Game/Beasts/PartyPlan";
import { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Beast } from "@/Game/Beasts/Beast";
import { boxKey, partiesKey } from "@/constants/GameConstants";
import { router, useFocusEffect } from "expo-router";
import React from "react";
import { createBox } from "@/Game/createStartup";

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
          const box = await createBox()
          if (isActive){
            setBox(box)
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