
import { Modal, View, StyleSheet, Button } from 'react-native';
import { BeastState } from '../Game/Battle/BeastState'
import { SupportSkill } from '@/Game/SkillDex/Support/SupportSkill';

export function SkillSelectModal({
    onRequestClose,
    useSkill,
    beast,
    visible,
}: {
    onRequestClose: () => void,
    useSkill: (beast: BeastState, skill: SupportSkill) => void,
    beast: BeastState | null,
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
            {beast && 
              beast.beast.supportSkills.map((skill) => {
                if (beast.currentCharge >= skill.chargeRequirement){
                  return <Button 
                    onPress={() => {
                      useSkill(beast, skill)
                      onRequestClose();
                    }}
                    title="Use skill"/>
                }
                return null
              })          
            }
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