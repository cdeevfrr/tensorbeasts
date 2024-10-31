import PartyPlanC from "@/components/PartyPlanC";
import { boxKey, dungeonStateKey, partiesKey } from "@/constants/GameConstants";
import { Beast } from "@/Game/Beasts/Beast";
import { PartyPlan } from "@/Game/Beasts/PartyPlan";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React from "react";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";

export default function EnterDungeon({
    inputParties
}: {
    inputParties: Array<PartyPlan>
}) {
    // TODO:
    // Let the player choose a partyPlan & a dungeon.
    const [parties, setParties] = useState<Array<PartyPlan>>(inputParties || [])

    // TODO:
    // Check if there's already a non-completed dungeonState.
    // If so, take them straight there.

    useFocusEffect(React.useCallback(() => {
      let isActive = true
      const cancelFunction = () => {
        isActive = false
      }

      const load = async () => {
        if (!inputParties){
          await refreshPartiesFromBox()
          const result = await AsyncStorage.getItem(partiesKey)

          if (result && isActive){
            setParties(JSON.parse(result))
          }
        }
      }

      load().catch(console.error)

      return cancelFunction
    }, []));

    if (parties.length === 0 
    || ( parties[0].core.every(beast => beast === null) )) {
      return <View style={styles.container}>
        <Text style={styles.text}>Enter Dungeon screen</Text>
        <Text style={styles.text}>You need to make a party with a core beast first!</Text>
      </View>
    }

    return (
      <View style={styles.container}>
        <Text style={styles.text}>Enter Dungeon screen</Text>
        <PartyPlanC editable={false} party={parties[0]}/>
        <Button
          title='Ready! Go to dungeon'
          onPress={() => {
            (async () => {
              // TODO: disable button before our async behavior.
              await AsyncStorage.removeItem(dungeonStateKey)
              router.replace({
                  pathname: '/dungeon',
                  params: {
                      partyNumber: 0,
                      dungeonNumber: 1,
                  }
              })
            })()
          }}
        />
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
    button: {
        fontSize: 20,
        textDecorationLine: 'underline',
        color: '#fff',
        margin: '5%'
    },
});

// Not sure where refreshPartiesFromBox function should live? 
// It lives here for now.
async function refreshPartiesFromBox () {
  const initPartyString = await AsyncStorage.getItem(partiesKey)
  if (!initPartyString){
    return
  }

  const boxString = await AsyncStorage.getItem(boxKey)
  if (!boxString){
    return
  }

  const box: Array<Beast> = JSON.parse(boxString)

  const initialParties: Array<PartyPlan> = JSON.parse(initPartyString)

  for (const party of initialParties){
    for (const array of [
      party.vanguard,
      party.core,
      party.support,
    ]) {
      for (let i = 0; i < array.length; i++){
        const uuid = array[i]?.uuid
        console.log("refreshing uuid " + uuid)
        if (uuid){
          array[i] = box.find(b => b.uuid === uuid) || null
        }
      }
    }
  }

  await AsyncStorage.setItem(partiesKey, JSON.stringify(initialParties))
}