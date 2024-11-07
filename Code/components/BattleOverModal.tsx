import { boxKey, dungeonStateKey } from "@/constants/GameConstants";
import { BattleState } from "@/Game/Battle/BattleState";
import { Beast, expForNextLevel, levelUp } from "@/Game/Beasts/Beast"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Button, Modal, StyleSheet, View, Text } from "react-native";
import { BeastRowC } from "./BeastRowC";
import { DungeonState } from "@/Game/Dungeon/DungeonState";
import { BeastC } from "./BeastC";

export function BattleOverModal({
    visible,
    battleState,
}: {
    visible: boolean,
    battleState: BattleState
}){
  const completed = () => {
    const saveState = async () => {
      console.log("Saving state")
      await saveRewards(battleState);
      await savePartyToDungeon(battleState);
      console.log("Saved state")
      router.navigate('/dungeon');
    }

    saveState().catch(console.error)
  }

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
            {/* {battleState.beastDrops && battleState.beastDrops.map(beast => {
              return <BeastC
                beast={beast}
                beastClickCallback={() => {}}
                key={beast.uuid}
              />
            })} */}
          {battleState.beastDrops && 
          <View style={{ height: 100, width: 400 }}>
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
async function saveRewards(battleState: BattleState){
    // Load box
    const boxString = await AsyncStorage.getItem(boxKey) || '[]'
    const box = JSON.parse(boxString) as Array<Beast>
    
    console.log(battleState.beastDrops)
    
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