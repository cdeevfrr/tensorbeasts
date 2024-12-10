import { FiveDContainer } from "@/components/FiveDContainer";
import { JSONView } from "@/components/JSONView";
import { Movement } from "@/components/Movement";
import { battleStateKey, dungeonStateKey, partiesKey } from "@/constants/GameConstants";
import { BattleState, completed, fall, lost } from "@/Game/Battle/BattleState";
import { toBeastState } from "@/Game/Battle/BeastState";
import { addLocations, emptyBoard, locationsEqual } from "@/Game/Battle/Board";
import { Beast } from "@/Game/Beasts/Beast";
import { DungeonState, generateNewDungeonRun, loadDungeon } from "@/Game/Dungeon/DungeonState";
import { Party } from "@/Game/Dungeon/Party";
import { isBoardSizePassive } from "@/Game/SkillDex/Passive/BoardSize";
import { PassiveSkills } from "@/Game/SkillDex/Passive/PassiveSkillList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React from "react";
import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle, Rect } from "react-native-svg";

// A bit misleading name - it really is the chance to get a new beast at this cleared location.
// A respawn would be the same beast again.
const respawnChance = 0.2

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

  // Check dungeonStateKey to make sure we're ready to start a new dungeon.
  useFocusEffect(React.useCallback(() => {
    let isActive = true
    const cancelFunction = () => {
      isActive = false
    }

    const load = async () => {
      const result = await AsyncStorage.getItem(dungeonStateKey)

      if (result === null || lost({playerParty: loadDungeon(result).party})) {
        const newDungeonState = await makeNewRun({
          partyNumberParam: partyNumber,
          dungeonNumberParam: dungeonNumber
        })
        if (isActive) {
          AsyncStorage.setItem(dungeonStateKey, JSON.stringify(newDungeonState))
          setDungeonState(newDungeonState)
        }
      } else {
        if (isActive){
          setDungeonState(loadDungeon(result))
        }
      }
    }

    load().catch(console.error);
    return cancelFunction
  }, []));




  if (dungeonState === null) {
    return <View style={styles.container}>
      <Text style={styles.text}>Loading...</Text>
    </View>
  }

  const playerComponent =<View style={{
    position: 'absolute',
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }}
  >
    <Svg 
    viewBox="0 0 100 100">
      <Circle
        cx="50"
        cy="50"
        r="30"
        stroke='black'
        strokeWidth="2.5"
        fill='grey'
      />
  </Svg>
  </View>

  const elements: Parameters<typeof FiveDContainer>[0]['elements'] = []
  for (const location of dungeonState.seen){
    let tileComponent = dungeonState.map.getTileAt({location}).image
    
    if (locationsEqual(location, dungeonState.location)){
      tileComponent = <View style={{
        width: '100%', 
        height: '100%',
      }}>
        {tileComponent}
        {playerComponent}
      </View>
    }

    elements.push({
      location,
      component: tileComponent
    })
  }

  // Always let people travel in the x direction.
  // Other dimensions are based on what party members are alive.
  const dimensions = [true, false, false, false, false]

  for (const array of [dungeonState.party.vanguard, dungeonState.party.support]){
    for (const beastState of array){
      if (beastState.currentHP > 0 && beastState.beast.passiveSkills){
        for (const passive of beastState.beast.passiveSkills){
          if (isBoardSizePassive(passive)){
            dimensions[passive.dimension] = true
          }
        }
      }
    }
  }

  return (
    <View style={styles.container}>
      <FiveDContainer elements={elements}/>
      <JSONView json={{
        location: dungeonState.location,
        seen: dungeonState.seen,
      }}/>
      <Movement
        dimensions={dimensions}
        moveCallback={(l) => {
          const newLocation = addLocations(dungeonState.location, l)

          const asyncBehavior = async () => {

            const newDungeonState = {
                ...dungeonState,
                location: newLocation
            }

            const isNewLocation = newDungeonState.seen.every(l => {
              const equal = ! locationsEqual(newLocation, l)
              return equal
            })

            if (isNewLocation){
              newDungeonState.seen.push(newLocation)
            }

            // Maybe create a battle state & save to async storage
            if ( isNewLocation ||  Math.random() < respawnChance) {
              const b = makeNewBattle({
                enemies: dungeonState.map.getBattleAt({location: newLocation}),
                party: dungeonState.party
              })

              await AsyncStorage.setItem(battleStateKey, JSON.stringify(b))

              // TODO run an animation
              router.navigate('/battle')
            }

            await AsyncStorage.setItem(dungeonStateKey, JSON.stringify(newDungeonState))
            setDungeonState(newDungeonState)
          }

          asyncBehavior().catch(console.error)
        }}
      />
    </View>
  );
}

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
      vanguard: enemies.map(toBeastState),
      core: [],
      support: [],
    },
    stack: []
  }

  console.log("Starting battle" + result)

  const fallen = fall(result)

  const passivesActivated = fallen

  for (const array of [party.vanguard, party.support]){
    for (const beast of array){
      if (beast.beast.passiveSkills){
        for (const passiveSkill of beast.beast.passiveSkills){
          const skillType = PassiveSkills[passiveSkill.type]
          if (skillType.activate){
            skillType.activate(
              passiveSkill,
              passivesActivated,
              beast
            )
          }
        }
      }
    }
  }

  return passivesActivated;
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    margin: '2%',
    justifyContent: 'center',
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
