
import { Modal, View, StyleSheet, Button, Text } from 'react-native';
import { BeastState } from '../Game/Battle/BeastState'
import { BeastStateC } from './BeastStateC';
import { Beast, expForNextLevel } from '@/Game/Beasts/Beast';
import { JSONView } from './JSONView';
import { BeastC } from './BeastC';

export function BeastDetailModal({
    onRequestClose,
    beast,
    visible,
}: {
    onRequestClose: () => void,
    beast: BeastState | Beast | null,
    visible: boolean,
}){
    const underlying = beast && isBeastState(beast)? beast.beast : beast

    return <Modal
        transparent={false}
        visible={visible}
        onRequestClose={() => {
          onRequestClose();
        }}>
          <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {
                beast && <View style={{flexDirection: 'row', height: '20%'}}> 
                  {isBeastState(beast)? 
                  <BeastStateC 
                    beast={beast}
                    beastClickCallback={() => {}}/>:
                  <BeastC
                    beast={beast}
                    beastClickCallback={() => {}}/>
                  }
                </View>
            }
            {beast && <Text>EXP to next level: {expForNextLevel({beast: underlying!})}</Text>}
            <JSONView json={beast}/>
            <Button onPress={()=> {
              onRequestClose();
            }} title='Done'/>
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
  },
  modalView: {
    margin: '2%',
    backgroundColor: "white",
    borderRadius: 5,
    padding: '4%',
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: '90%',
    flex: 1,
    justifyContent: 'center'
  },
})

function isBeastState(b: Beast | BeastState): b is BeastState{
    return (b as BeastState).beast !== undefined
}

function isBeast(b: Beast | BeastState): b is Beast{
    return (b as BeastState).beast === undefined
}