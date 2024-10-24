import { boxKey, dungeonStateKey } from "@/constants/GameConstants";
import { BattleState } from "@/Game/Battle/BattleState";
import { Beast, expForNextLevel, levelUp } from "@/Game/Beasts/Beast"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Button, Modal, StyleSheet, View, Text } from "react-native";
import { BeastRowC } from "./BeastRowC";
import { DungeonState } from "@/Game/Dungeon/DungeonState";

export function DiedModal({
    visible,
}: {
    visible: boolean,
}){
  return <Modal
      transparent={true}
      visible={visible}
      onRequestClose={() => router.navigate('/')}>
        <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text>You died!</Text>
          <Button onPress={() => router.navigate('/')} title='Return home'/>
          <Text> Rewards for your successful battles been saved to your box.</Text>
          <Text> Your dead beasts will be in your box </Text>
        </View>
        </View>
    </Modal>
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