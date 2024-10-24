import PartyPlanC from "@/components/PartyPlanC";
import { dungeonStateKey, partiesKey } from "@/constants/GameConstants";
import { PartyPlan } from "@/Game/Beasts/PartyPlan";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
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

    useEffect(() => {
        AsyncStorage.getItem(partiesKey).then((result) => {
          if (result){
            setParties(JSON.parse(result))
          }
        });
    }, []);

    return (
      <View style={styles.container}>
        <Text style={styles.text}>Enter Dungeon screen</Text>
        {(
            parties.length > 0 
            && ( // nonempty party
                ! parties[0].vanguard.every(beast => beast === null)
                || ! parties[0].core.every(beast => beast === null)
                || ! parties[0].support.every(beast => beast === null)
            )
        )? 
            <View style={styles.container}>
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
            :
            <Text style={styles.text}>You need to make a party first!</Text>
        }
        
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