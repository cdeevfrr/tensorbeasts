import { BeastRowC } from '@/components/BeastRowC';
import { BlockBoardC } from '@/components/BlockBoardC';
import { StackC } from '@/components/StackC';
import { DungeonState } from '@/Game/Dungeon/DungeonState';
import { Skills } from '@/Game/SkillDex/SkillTypeList';
import { useState } from 'react';
import { Text, View, StyleSheet, Button, Alert, Modal } from 'react-native';



export default function DungeonScreen({dungeonState}: {dungeonState: DungeonState}) {
  dungeonState = pseudodungeon

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBeast, setSelectedBeast] = useState<BeastState | null>(null)

  const beastClickedCallback = (beast: BeastState) => {
    console.log("Clicked")
    setSelectedBeast(beast)
    setModalVisible(true);
  };



  return (
    <View style={styles.container}>
      {/* Left side */}
      <View style={styles.leftBlock}>
          {/* Render any enemies */} 
          <BeastRowC 
              beasts={dungeonState.enemies}
              beastClickCallback={() => {}}/>

          {/* Render the block board */} 
          <BlockBoardC board={dungeonState.board}/>

          {/* Render the current party */} 
          <BeastRowC 
              beasts={dungeonState.party}
              beastClickCallback={beastClickedCallback}
              />
      </View>
      {/* Right side */}
      <View style={styles.rightBlock}>
        <View style={styles.stack}>
          <Text>HI</Text>
          <Text>There</Text>

          <StackC 
            destroyEvents={dungeonState.stack}
          />
        </View>
        <View style={styles.attackButton}>
          <Button 
            title="Attack" 
            onPress={() => {}}/>
        </View>
      </View>
      {/* Confirm/cancel modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}>
          <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {selectedBeast && 
              selectedBeast.beast.SupportSkills.map((skill) => {
                if (selectedBeast.currentCharge >= skill.chargeRequirement){
                  return <Button 
                    onPress={() => {
                      console.log("Pretend skill use")
                      setModalVisible(false);
                    }}
                    title="Use skill"/>
                }
                return null
              })          
            }
            <Button onPress={()=> {
              console.log("Cancelled skill use")
              setModalVisible(false);
            }} title='Cancel'/>
          </View>
          </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center'
  },
  leftBlock: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightBlock: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stack: {
    flex: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attackButton: {
    flex: 1
  },
  text: {
    color: '#fff',
  },
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
});


const pseudodungeon: DungeonState = {
  party: [{
    beast: {
      colors: [1],
      species: 1,

      baseAttack: 1,
      baseDefense: 1,
      baseHP: 100,


      attackGain: 1,
      defenseGain: 1,
      hpGain: 1,

      experience: 100,
      level: 1,
      growthRate: 1,

      SupportSkills: [Skills.SingleBlockDestroy.factory({})],
    },
    currentCharge: 49,
    currentHP: 70,
    maxHP: 100,
  },
  {
    beast: {
      colors: [1],
      species: 1,

      baseAttack: 1,
      baseDefense: 1,
      baseHP: 100,


      attackGain: 1,
      defenseGain: 1,
      hpGain: 1,

      experience: 100,
      level: 1,
      growthRate: 1,

      SupportSkills: [Skills.SingleBlockDestroy.factory({}), Skills.MatchColorBlockDestroy.factory({})],
    },
    currentCharge: 30,
    currentHP: 100,
    maxHP: 100,
  }],
  enemies: [],
  board: {
    blocks: [
      [[[[{
        color: 1,
        number: 1,
        shape: 1,
      }]]]],
      [[[[{
        color: 2,
        number: 1,
        shape: 1,
      }]]]],
      [[[[{
        color: 3,
        number: 1,
        shape: 1,
      }]]]]
    ]
  },
  stack: []
}