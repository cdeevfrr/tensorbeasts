import { boxKey } from "@/constants/GameConstants";
import { BattleState } from "@/Game/Battle/BattleState";
import { Beast, expForNextLevel, levelUp } from "@/Game/Beasts/Beast"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Button, Modal, StyleSheet, View, Text } from "react-native";

export function BattleOverModal({
    visible,
    battleState,
}: {
    visible: boolean,
    battleState: BattleState
}){
  const completed = () => {
    saveRewards(battleState);
    router.navigate('/dungeon');
  }

  return <Modal
      transparent={true}
      visible={visible}
      onRequestClose={completed}>
        <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text>You did it!</Text>
          <Button onPress={completed} title='Done'/>
        </View>
        </View>
    </Modal>
}

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