import { boxKey, dungeonStateKey } from "@/constants/GameConstants";
import { BattleState, findBeast, rewardExp } from "@/Game/Battle/BattleState";
import { Beast, expForNextLevel, levelUp } from "@/Game/Beasts/Beast"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { Button, Modal, StyleSheet, View, Text, Animated } from "react-native";
import { BeastRowC } from "./BeastRowC";
import { DungeonState } from "@/Game/Dungeon/DungeonState";
import React, { useRef } from "react";
import { BeastLevelView, LeveledBeast } from "./BeastLevelView";

export function BattleOverModal({
    visible,
    battleState,
}: {
    visible: boolean,
    battleState: BattleState
}){
  const animationPercentage = useRef(new Animated.Value(0));

  const rewardedState = rewardExp(battleState)

  const leveledBeasts: Array<LeveledBeast> = []
  for (const array of [
    rewardedState.playerParty.support,
    rewardedState.playerParty.core,
    rewardedState.playerParty.vanguard
  ]){
    for (const beast of array){
      const prevBeast = findBeast(battleState, beast)
      if (prevBeast){
        if (prevBeast.beast.level != beast.beast.level){
          leveledBeasts.push({prev: prevBeast.beast, new: beast.beast})
        }
      }
    }
  }

  const completed = () => {
    const saveState = async () => {
      console.log("Saving state")
      await saveBeastRewardsToBox(rewardedState);
      await savePartyToDungeon(rewardedState);
      console.log("Saved state")
      router.navigate('/dungeon');
    }

    saveState().catch(console.error)
  }

  useFocusEffect(React.useCallback(() => {
    animationPercentage.current.resetAnimation()

    Animated.timing(
      animationPercentage.current,
      {
        toValue: 1,
        useNativeDriver: false,
        duration: 2000,
      }
    )
  }, []))

  return <Modal
      transparent={true}
      visible={visible}
      onRequestClose={completed}>
        <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text>You did it!</Text>
          <Button onPress={completed} title='Done'/>

          <Text>Rewards: </Text>
          <Text>EXP: {battleState.expReward}</Text>

          {leveledBeasts.length > 0 && <View style={{height: 100, width: 400}}>
            <Text>{leveledBeasts.length} beast(s) leveled up!</Text>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start'}}>
              {leveledBeasts.map((leveledBeast) => {
                return <BeastLevelView leveledBeast={leveledBeast}/>
              }) }
            </View>
          </View>}

          {battleState.beastDrops && 
          <View style={{ height: 100, width: 400 }}>
            <Text>Drops sent to the box</Text>
            <BeastRowC
              beasts={battleState.beastDrops}
              beastClickCallback={() => { }}
            />
          </View>}
        </View>
        </View>
    </Modal>
}

// DON'T export this!
// it's kinda hacky for the modal to go to storage like this.
async function saveBeastRewardsToBox(battleState: BattleState){
    // Load box
    const boxString = await AsyncStorage.getItem(boxKey) || '[]'
    const box = JSON.parse(boxString) as Array<Beast>
        
    // Save new drops to box.
    for (const drop of battleState.beastDrops || []){
        box.push(drop)
    }

    // Save exp to all beasts with same ID as in battle, and still alive
  for (const array of [
    battleState.playerParty.vanguard,
    battleState.playerParty.core,
    battleState.playerParty.support
  ]) {
    for (const beast of array) {
      if (beast.currentHP > 0) {
        const index = box.findIndex(b => b.uuid === beast.beast.uuid)
        let savedBeast = box[index]
        if (savedBeast) {
          if (!savedBeast.growthDetails) {
            throw new Error("Beasts in the box should have growth details.")
          }

          savedBeast.growthDetails.experience += battleState.expReward || 0
          // TODO: Get rid of the ?.experience here. Need to rejigger types to fix this.
          while (savedBeast.growthDetails?.experience || 0 > expForNextLevel({ beast: savedBeast })) {
            savedBeast = levelUp({ beast: savedBeast })
          }
        }
        box[index] = savedBeast
      }
    }
  }

    // Save box
    console.log("Saving new box " + JSON.stringify(box))
    await AsyncStorage.setItem(boxKey, JSON.stringify(box))
}

// DON'T export this!
// it's kinda hacky to go to storage like this.
async function savePartyToDungeon(b: BattleState){
  const dungeonString = await AsyncStorage.getItem(dungeonStateKey)

  console.log("Updating dungeon state " + dungeonString)

  if (!dungeonString){
    return
  }

  const dungeon: DungeonState = JSON.parse(dungeonString) 

  dungeon.party = b.playerParty

  console.log("Updated dungeon state: " + JSON.stringify(dungeon))

  await AsyncStorage.setItem(dungeonStateKey, JSON.stringify(dungeon))
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  }
})