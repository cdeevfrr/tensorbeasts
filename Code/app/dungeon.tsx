import { JSONView } from "@/components/JSONView";
import { Movement } from "@/components/Movement";
import { battleStateKey, dungeonStateKey, partiesKey } from "@/constants/GameConstants";
import { BattleState, fallOne } from "@/Game/Battle/BattleState";
import { toBeastState } from "@/Game/Battle/BeastState";
import { addLocations, emptyBoard } from "@/Game/Battle/Board";
import { Beast } from "@/Game/Beasts/Beast";
import { DungeonState, generateNewDungeonRun, isRunComplete, loadDungeon } from "@/Game/Dungeon/DungeonState";
import { Party } from "@/Game/Dungeon/Party";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function Dungeon({
  initialDungeonState,
}: {
  initialDungeonState?: DungeonState
}) {
  const params = useLocalSearchParams();
  // If we're starting a new dungeon run, these
  // will be used. Otherwise we'll rely on saved dungeon run state.
  const { partyNumber, dungeonNumber } = params;

  const [dungeonState, setDungeonState] = useState<DungeonState | null>(initialDungeonState || null)

  const navigation = useNavigation();

  // Check dungeonStateKey to make sure we're ready to start a new dungeon.
  useEffect(() => {
    const load = async () => {
      const result = await AsyncStorage.getItem(dungeonStateKey)

      if (result === null || isRunComplete(JSON.parse(result))) {
        setDungeonState(
          await makeNewRun({
            partyNumberParam: partyNumber,
            dungeonNumberParam: dungeonNumber
          }))
      } else {
        setDungeonState(loadDungeon(result))
      }
    }

    load().catch(console.error);
  }, []);

  if (dungeonState === null) {
    return <View style={styles.container}>
      <Text style={styles.text}>Loading...</Text>
    </View>
  }



  return (
    <View style={styles.container}>
      <JSONView json={dungeonState}/>
      <Movement
        dimensions={[true, false, false, false, false]}
        moveCallback={(l) => {
          const newLocation = addLocations(dungeonState.location, l)
          setDungeonState({
            ...dungeonState,
            location: newLocation
          })

          // TODO: If you haven't cleared that location yet
          // Create battle state & save to async storage
          const b = makeNewBattle({
            enemies: dungeonState.map.getBattleAt({location: newLocation}),
            party: dungeonState.party
          })

          console.log("Created new battle " + JSON.stringify(b))

          AsyncStorage.setItem(battleStateKey, JSON.stringify(b))

          // TODO run an animation

          // Navigate to the battle screen!
          // Make sure a 'pop' will put you back in the dungeon screen.
          router.navigate('/battle')
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    margin: '2%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewContainer: {
    flex: 1,
    backgroundColor: '#25292e',
    margin: '2%',
  },
  text: {
    color: '#fff',
  },
});

async function makeNewRun({
  partyNumberParam,
  dungeonNumberParam,
}: {
  partyNumberParam: string | undefined | string[],
  dungeonNumberParam: string | undefined | string[],
}): Promise<DungeonState> {
  if (partyNumberParam === undefined || dungeonNumberParam === undefined
    || Array.isArray(partyNumberParam) || Array.isArray(dungeonNumberParam)
  ) {
    throw new Error("Cannot make a dungeon run with these params: " + JSON.stringify({
      partyNumberParam,
      dungeonNumberParam
    }))
  }
  const partyNumber = JSON.parse(partyNumberParam)
  const dungeonNumber = JSON.parse(dungeonNumberParam)

  // loaded shouldn't be null because users should only get here 
  // via the enterDungeon screen, which checks for a valid party.
  const loaded = await AsyncStorage.getItem(partiesKey)
  const parties = JSON.parse(loaded || '[]')
  return generateNewDungeonRun({
    partyPlan: parties[partyNumber], // Shouldn't get index error for same reason.
    dungeonMapNumber: dungeonNumber
  })
}

function makeNewBattle({party, enemies}:{party: Party, enemies: Array<Beast>}): BattleState {
  const result: BattleState = {
    board: emptyBoard([3,1,1,1,1]),
    playerParty: party,
    enemyParty: {
      vanguard: [],
      core: enemies.map(toBeastState),
      support: [],
    },
    stack: []
  }

  console.log("Starting battle" + result)

  let fall = fallOne(result)
  
  while(fall.board.blocks[0][0][0][0][0] === null){
    fall = fallOne(fall)
  }

  return fall;
}
