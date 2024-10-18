import { BeastStateRowC } from '@/components/BeastStateRowC';
import { BlockBoardC } from '@/components/BlockBoardC';
import { SkillSelectModal } from '@/components/SkillSelectModal';
import { StackC } from '@/components/StackC';
import { SupportSkill } from '@/Game/SkillDex/Support/SupportSkill';
import { BeastState } from '@/Game/Battle/BeastState';
import { BattleState, processBeastAttack, useSkill } from '@/Game/Battle/BattleState';
import { SupportSkills } from '@/Game/SkillDex/Support/SupportSkillList';
import { useState } from 'react';
import { Text, View, StyleSheet, Button, Alert, Modal } from 'react-native';
import { CoreAttackSkills } from '@/Game/SkillDex/Core/CoreAttack/CoreAttackList';
import { ConfirmCoreModal } from '@/components/ConfirmCoreModal';
import { CoreAttackSkill } from '@/Game/SkillDex/Core/CoreAttack/CoreAttackSkill';
import { calculateAttack } from '@/Game/Battle/PowerSpread';
import { v4 as uuidv4 } from 'uuid';



// Flow from not yet attacking (initial) to 
// selecting a core beast (match style & core attack style)
// to selecting which beast attacks which other beasts (select targets)
type attackFlowState = {
  state: 'initial' | 'pickCore' | 'confirmCore' | 'selectAttackerOrFinish' | 'selectTarget',
  coreBeast?: BeastState,
  selectedAttacker?: BeastState,
}

export default function BattleScreen({loadedState}: {loadedState: BattleState}) {
  loadedState = pseudodungeon

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBeast, setSelectedBeast] = useState<BeastState | null>(null)
  const [battleState, setBattleState] = useState(loadedState)

  const [attackFlowState, setAttackFlowState] = useState<attackFlowState>({state: 'initial'})

  console.log(battleState)


  // TODO: Combine these two callbacks into a supportSkillFlowState
  const useSupportSkillCallback = (beast: BeastState) => {
    setSelectedBeast(beast)
    setModalVisible(true);
  };
  const useSkillCallback = (beast: BeastState, skill: SupportSkill) => {
    const newState = useSkill(battleState, beast, skill)
    setBattleState(newState)
  }

  return (
    <View style={styles.container}>
      {/* Left side */}
      <View style={styles.leftBlock}>
          {/* Render any enemies */} 
          <BeastStateRowC 
              beasts={battleState.enemies}
              beastClickCallback={() => {}}
              minimize={attackFlowState.state == 'pickCore'}
          />

          {/* Render the block board */} 
          <BlockBoardC board={battleState.board}/>

          {/* Vanguard */} 
          <BeastStateRowC 
              beasts={battleState.vanguard}
              beastClickCallback={() => {}}
              minimize={attackFlowState.state == 'pickCore'}
              />
          {/* Core */} 
          <BeastStateRowC 
              beasts={battleState.core}
              beastClickCallback={attackFlowState.state == 'pickCore'? (beast: BeastState) => {
                  // TODO: confirm button?
                  setAttackFlowState({
                    state: 'confirmCore',
                    coreBeast: beast,
                  })
                }: 
                () => {}}
              />
          {/* Support */} 
          <BeastStateRowC 
              beasts={battleState.support}
              beastClickCallback={
                attackFlowState.state == 'initial'? 
                  useSupportSkillCallback : 
                  () => {}}
              minimize={attackFlowState.state == 'pickCore'}
              />
      </View>
      {/* Right side */}
      <View style={styles.rightBlock}>
        <View style={styles.stack}>
          <Text>Stack</Text>
          <StackC 
            destroyEvents={battleState.stack}
          />
        </View>
        <View style={styles.attackButton}>
          {attackFlowState.state == 'initial' && <Button 
            title={"Attack"} 
            onPress={() => {
              setAttackFlowState({state: 'pickCore'})
              }}/>
            }
          {attackFlowState.state == 'selectAttackerOrFinish' && <Button 
            title={"Do it!"} 
            onPress={async () => {
              await animateTeamAttacks({
                battleState,
                setBattleState,
              })
              setAttackFlowState({
                state: 'initial'
              })
              }}/>
            }
        </View>
      </View>
      {/* Confirm/cancel modals */}
      <SkillSelectModal
        beast={selectedBeast}
        onRequestClose={() => setModalVisible(false)}
        useSkill={useSkillCallback}
        visible={modalVisible}
      />
      {attackFlowState.state == 'confirmCore' && <ConfirmCoreModal
        beast={attackFlowState.coreBeast as BeastState} // We know it's not undefined in this state. 
        onRequestClose={() => setAttackFlowState({state: 'initial'})}
        onRequestConfirm={async () => {
            setAttackFlowState({
              ...attackFlowState,
              state: 'selectAttackerOrFinish'
            })
            await matchAnimation({
              battleState,
              matchCriteria: undefined, // attackFlowState.coreBeast?.beast.coreMatchSkill,
              setBattleState,
            })
            console.log("Done matching")
            await calculateDamageAnimation({
              battleState: battleState,
              coreAttackCriteria: attackFlowState.coreBeast?.beast?.coreAttackSkill,
              setBattleState: setBattleState,
            })
            console.log("Done calculating damage")
        }}
        visible={attackFlowState.state == 'confirmCore'}
      />}
    </View>
  );
}

async function matchAnimation({
  battleState,
  matchCriteria,
}: {
  battleState: BattleState
  matchCriteria: undefined,
  setBattleState: (d: BattleState) => void
}){
  // todo: 
  // define `matchOne` in BattleState
  // In this function:
  // until no changes: {
  //    repeatedly call matchOne, setBattleState, until no matches found
  //    until no changes: {
  //       repeatedly call fallOne, setBattleState
  //    }
  // }
}

async function calculateDamageAnimation({
  battleState: battleState,
  coreAttackCriteria,
  setBattleState: setBattleState,
}: {
  battleState: BattleState,
  coreAttackCriteria?: CoreAttackSkill,
  setBattleState: (d: BattleState) => void,
}){
  if (!coreAttackCriteria){
    return
  }
  const newBattleState: BattleState = JSON.parse(JSON.stringify(battleState))
  newBattleState.stack = []

  const powerSpread = CoreAttackSkills[coreAttackCriteria.type].process({
    self: coreAttackCriteria,
    stack: battleState.stack
  })

  for (const beast of [...newBattleState.vanguard, ...newBattleState.core, ...newBattleState.support]){
    beast.pendingAttacks = []
    const powers = calculateAttack({
      powerSpread,
      beast: beast.beast
    })
    for (const power of powers){
      beast.pendingAttacks.push({
        target: {
          array: 'enemies',
          index: 0,
        },
        ...power
      })
    }
    console.log("Calculated beast " + JSON.stringify(beast))
    setBattleState(JSON.parse(JSON.stringify(newBattleState)))
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
}


type arrayName = 'vanguard' | 'core' | 'support' | 'enemies'
async function animateTeamAttacks({
  battleState: battleState,
  setBattleState: setBattleState,
}:{
  battleState: BattleState
  setBattleState: (d: BattleState) => void
}){
  // Actions taken while animating will be undone, since we'll keep setting
  // battleState equal to this animatedBattleState (which nothing else can touch.)
  let animatedBattleState = battleState
  const groupsToAttack: Array<arrayName> = ['vanguard', 'core', 'support']
  for (const array of groupsToAttack) {
    for (let i = 0; i < battleState[array].length; i++){
      animatedBattleState = processBeastAttack({
        d: animatedBattleState,
        beastLocation: {
          array: array,
          index: i
        }
      })
      setBattleState(animatedBattleState)
      await new Promise(resolve => setTimeout(resolve, 500));

    }
  }
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
    alignItems: 'center',
  },
  attackButton: {
    flex: 1
  },
  text: {
    color: '#fff',
  },
});


const pseudodungeon: BattleState = {
  vanguard: [],
  core: [{
    beast: {
      uuid: uuidv4(),
      colors: [2],
      species: 2,

      baseAttack: 12,
      baseDefense: 1,
      baseHP: 100,

      growthDetails: {

        attackGain: 1,
        defenseGain: 1,
        hpGain: 1,
  
        experience: 100,
        growthRate: 1,
      },
      level: 1,

      supportSkills: [],
      coreMatchSkill: {
        fixME: 1
      },
      coreAttackSkill: {
        ...CoreAttackSkills.CountAttack.factory({quality: 1}),
        type: "CountAttack"
      }

    },
    currentCharge: 0,
    currentHP: 100,
    maxHP: 100,
  }],
  support: [{
    beast: {
      uuid: uuidv4(),
      colors: [1],
      species: 1,

      baseAttack: 1,
      baseDefense: 1,
      baseHP: 100,

      growthDetails: {

        attackGain: 1,
        defenseGain: 1,
        hpGain: 1,
  
        experience: 100,
        growthRate: 1,
      },
      level: 1,

      supportSkills: [{
        ...SupportSkills.SingleBlockDestroy.factory({}),
        type: "SingleBlockDestroy"
      }],
    },
    currentCharge: 60,
    currentHP: 70,
    maxHP: 100,
  },
  {
    beast: {
      uuid: uuidv4(),
      colors: [1],
      species: 1,

      baseAttack: 1,
      baseDefense: 1,
      baseHP: 100,

      growthDetails: {

        attackGain: 1,
        defenseGain: 1,
        hpGain: 1,
  
        experience: 100,
        growthRate: 1,
      },

      level: 1,

      supportSkills: [
        {
          ...SupportSkills.SingleBlockDestroy.factory({}),
          type: "SingleBlockDestroy"
        }, 
        {
          ...SupportSkills.MatchColorBlockDestroy.factory({}),
          type: "MatchColorBlockDestroy"
        }],
    },
    currentCharge: 30,
    currentHP: 100,
    maxHP: 100,
  }],
  enemies: [{
    currentCharge: 50,
    currentHP: 100,
    maxHP: 100,
    beast: {
      uuid: uuidv4(),
      baseAttack: 100,
      baseDefense: 2,
      baseHP: 100,
      level: 1,
      species: 3,
      supportSkills: [],
      colors: [2],
    }
  }],
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