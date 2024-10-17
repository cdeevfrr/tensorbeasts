
import { Modal, View, StyleSheet, Button, Text } from 'react-native';
import { BeastState } from '../Game/Battle/BeastState'
import { SupportSkill } from '@/Game/SkillDex/Support/SupportSkill';
import { BeastStateC } from './BeastStateC';

export function ConfirmCoreModal({
    onRequestClose,
    onRequestConfirm,
    beast,
    visible,
}: {
    onRequestClose: () => void,
    onRequestConfirm: () => void,
    beast: BeastState,
    visible: boolean,
}){
    return <Modal
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          onRequestClose();
        }}>
          <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>Are you sure you want to use this core beast this turn?</Text>
            <BeastStateC beast={beast} beastClickCallback={()=>{}}/>
            <Button 
                    onPress={onRequestConfirm}
                    title="Confirm"
            />     
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
    elevation: 5
  },
  skillButton: {
    padding: 10
  }
})