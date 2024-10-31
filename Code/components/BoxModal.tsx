
import { Modal, View, StyleSheet, Button } from 'react-native';
import { Beast } from '@/Game/Beasts/Beast';
import { BeastC } from './BeastC';
import { BoxC } from './BoxC';

export function BoxModal({
    onRequestClose,
    onSelect,
    box,
    visible,
    canSelectNull = false,
}: {
    onRequestClose: () => void,
    onSelect: (beast: Beast | null) => void,
    box: Array<Beast>,
    visible: boolean,
    canSelectNull: boolean,
}){
  return <Modal
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        onRequestClose();
      }}>
        <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <BoxC 
            box={box} 
            canSelectNull={canSelectNull} 
            beastClickedCallback={onSelect}/>
          <Button onPress={()=> {
            onRequestClose();
          }} title='Cancel'/>
        </View>
        </View>
    </Modal>
}

const styles = StyleSheet.create({
  // these next styles came from https://stackoverflow.com/questions/68350980/react-native-floating-or-popup-screen-question
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
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
    height: '70%',
    width: '50%',
  },
  skillButton: {
    padding: 10
  }
})