import { BeastRowC } from '@/components/BeastRowC';
import { BeastStateC } from '@/components/BeastStateC';
import { BloclBoardC } from '@/components/BlockBoardC';
import { DungeonState } from '@/Game/Dungeon/DungeonState';
import { Text, View, StyleSheet } from 'react-native';



export default function DungeonScreen({dungeonState}: {dungeonState: DungeonState}) {
  dungeonState = pseudodungeon
  return (
    <View style={styles.container}>
        {/* Render any enemies */} 
        <BeastRowC beasts={dungeonState.enemies}/>

        {/* Render the block board */} 
        <BloclBoardC board={dungeonState.board}/>

        {/* Render the current party */} 
        <BeastRowC beasts={dungeonState.party}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
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

      SupportSkills: [],
    },
    currentCharge: 0,
    currentHP: 100,
    maxHP: 100,
  }],
  enemies: [],
  board: {
    xLength: 3,
    yLength: 1,
    zLength: 1,
    aLength: 1,
    bLength: 1,
    blocks: [
      {
        color: 1,
        number: 1,
        shape: 1,
      },
      {
        color: 2,
        number: 1,
        shape: 1,
      },
      {
        color: 3,
        number: 1,
        shape: 1,
      }
    ]
  }
}