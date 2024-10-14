import { BeastRowC } from '@/components/BeastRowC';
import { BlockBoardC } from '@/components/BlockBoardC';
import { SkillSelectModal } from '@/components/SkillSelectModal';
import { StackC } from '@/components/StackC';
import { SupportSkill } from '@/Game/Beasts/SupportSkill';
import { BeastState } from '@/Game/Dungeon/BeastState';
import { DungeonState, useSkill } from '@/Game/Dungeon/DungeonState';
import { Skills } from '@/Game/SkillDex/SkillTypeList';
import { useState } from 'react';
import { Text, View, StyleSheet, Button, Alert, Modal } from 'react-native';



export default function DungeonScreen({loadedState}: {loadedState: DungeonState}) {
  loadedState = pseudodungeon

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBeast, setSelectedBeast] = useState<BeastState | null>(null)
  const [dungeonState, setDungeonState] = useState(loadedState)

  const beastClickedCallback = (beast: BeastState) => {
    setSelectedBeast(beast)
    setModalVisible(true);
  };

  const useSkillCallback = (beast: BeastState, skill: SupportSkill) => {
    const newState = useSkill(dungeonState, beast, skill)
    console.log("Old state:" + JSON.stringify(dungeonState))
    console.log("New state:" + JSON.stringify(newState))
    setDungeonState(newState)
  }



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
      <SkillSelectModal
        beast={selectedBeast}
        onRequestClose={() => setModalVisible(false)}
        useSkill={useSkillCallback}
        visible={modalVisible}
      />
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
    minHeight: 0,
    minWidth: 0,
    maxHeight: '95%'
  },
  rightBlock: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 0,
    minWidth: 0,
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

      SupportSkills: [{
        ...Skills.SingleBlockDestroy.factory({}),
        type: "SingleBlockDestroy"
      }],
    },
    currentCharge: 60,
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

      SupportSkills: [
        {
          ...Skills.SingleBlockDestroy.factory({}),
          type: "SingleBlockDestroy"
        }, 
        {
          ...Skills.MatchColorBlockDestroy.factory({}),
          type: "MatchColorBlockDestroy"
        }],
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
      }]]]],
      [[[[{
        color: 4,
        number: 1,
        shape: 1,
      }]]]],
      [[[[{
        color: 5,
        number: 1,
        shape: 1,
      }]]]],
      [[[[{
        color: 6,
        number: 1,
        shape: 1,
      }]]]]
    ]
  },
  stack: []
}