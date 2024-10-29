import { BeastStateRowC } from '@/components/BeastStateRowC';
import { BlockBoardC } from '@/components/BlockBoardC';
import { SkillSelectModal } from '@/components/SkillSelectModal';
import { StackC } from '@/components/StackC';
import { SupportSkill } from '@/Game/SkillDex/Support/SupportSkill';
import { BeastState } from '@/Game/Battle/BeastState';
import { addCharge, BattleState, findNextAttacker, lost, processBeastAttack, useSkill, won } from '@/Game/Battle/BattleState';
import { SupportSkills } from '@/Game/SkillDex/Support/SupportSkillList';
import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Button, Alert, Modal, Pressable } from 'react-native';
import { CoreAttackSkills } from '@/Game/SkillDex/Core/CoreAttack/CoreAttackList';
import { ConfirmCoreModal } from '@/components/ConfirmCoreModal';
import { CoreAttackSkill } from '@/Game/SkillDex/Core/CoreAttack/CoreAttackSkill';
import { calculateAttack } from '@/Game/Battle/PowerSpread';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { battleStateKey } from '@/constants/GameConstants';
import { BattleOverModal } from '@/components/BattleOverModal';
import { DiedModal } from '@/components/DiedModal';
import { useFocusEffect } from 'expo-router';
import React from 'react';



// Flow from not yet attacking (initial) to 
// selecting a core beast (match style & core attack style)
// to selecting which beast attacks which other beasts (select targets)
type attackFlowState = {
  state: 'initial' | 'pickCore' | 'confirmCore' | 'selectAttackerOrFinish' | 'selectTarget' | 'animating',
  coreBeast?: BeastState,
  selectedAttacker?: BeastState,
}

const animationMs = 300

const runningInterval: {interval: null | NodeJS.Timeout} = {
  interval: null
}

export default function BattleScreen({
  presetState
}: {
  presetState: BattleState
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBeast, setSelectedBeast] = useState<BeastState | null>(null)
  const [battleState, setBattleState] = useState<BattleState | undefined>(presetState)
  const [attackFlowState, setAttackFlowState] = useState<attackFlowState>({state: 'initial'})

  if (!presetState){
    useFocusEffect(React.useCallback(() => {
      let isActive = true
      const cancelFunction = () => {
        isActive = false
      }
      const load = async () => {
        const battleStateString = await AsyncStorage.getItem(battleStateKey)
        if (battleStateString) {
          if (isActive){
            setBattleState(JSON.parse(battleStateString))
          }
        } 
      }

      load().catch(console.error)

      return cancelFunction
    }, []));
  }

  if (battleState === undefined){
    return <Text>Loading</Text>
  }


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
              beasts={[
                ...battleState.enemyParty.support,
              ]}
              beastClickCallback={() => {}}
              minimize={attackFlowState.state == 'pickCore'}
          />
          <BeastStateRowC 
              beasts={[
                ...battleState.enemyParty.core,
              ]}
              beastClickCallback={() => {}}
              minimize={attackFlowState.state == 'pickCore'}
          />
          <BeastStateRowC 
              beasts={[
                ...battleState.enemyParty.vanguard,
              ]}
              beastClickCallback={() => {}}
              minimize={attackFlowState.state == 'pickCore'}
          />

          {/* Render the block board */} 
          <BlockBoardC board={battleState.board}/>

          {/* Vanguard */} 
          <BeastStateRowC 
              beasts={battleState.playerParty.vanguard}
              beastClickCallback={() => {}}
              minimize={attackFlowState.state == 'pickCore'}
              />
          {/* Core */} 
          <BeastStateRowC 
              beasts={battleState.playerParty.core}
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
              beasts={battleState.playerParty.support}
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
              setAttackFlowState({
                ...attackFlowState,
                state: 'animating'
              })
              await animateTeamAttacks({
                battleState,
                setBattleState,
              })
              setAttackFlowState({
                state: 'initial'
              })
              }}/>
            }
          {attackFlowState.state == 'initial' && <Pressable
              onPressIn={(e) => {
                runningInterval.interval = setInterval(
                  () => {
                    setBattleState((prevBattleState)=> {
                      return prevBattleState && addCharge(prevBattleState, 1)
                    })
                  },
                  100
                )
                e.stopPropagation()
              }}
              onPressOut={(e)=>{
                runningInterval.interval &&
                clearInterval(runningInterval.interval)
                e.stopPropagation()
              }}
              style={({pressed}) => [
                styles.button,
                pressed && styles.pressedButton
              ]}>
              <Text style={styles.text} suppressHighlighting={true} selectable={false}>Charge</Text>
            </Pressable>
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
              state: 'animating'
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
            setAttackFlowState({
              ...attackFlowState,
              state: 'selectAttackerOrFinish'
            })
            console.log("Done calculating damage")
        }}
        visible={attackFlowState.state == 'confirmCore'}
      />}
      <BattleOverModal
        visible={won(battleState)}
        battleState = {battleState}/>
      {lost(battleState) && <DiedModal visible={true}/>}
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


// TODO:
// This function should animate one stack process at a time, not one beast at a time.
// It should also divide the calculation part (especially the target choice) from the animation order.
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

  // Player calculation
  for (const array of [
    newBattleState.playerParty.vanguard,
    newBattleState.playerParty.core,
    newBattleState.playerParty.support,
  ]){
    for (const beast of array){
      beast.pendingAttacks = []
      const powers = calculateAttack({
        powerSpread,
        beast: beast.beast
      })
      for (const power of powers){
        beast.pendingAttacks.push({
          target: {
            party: 'enemyParty',
            partylocation: {
              array: 'vanguard',
              index: 0
            }
          },
          ...power
        })
      }
      console.log("Calculated beast " + beast.beast.uuid)
      setBattleState(JSON.parse(JSON.stringify(newBattleState)))
      await new Promise(resolve => setTimeout(resolve, animationMs));
    }
  }

  // Enemy calculation (should be consolidated with player calculation.)
  for (const array of [
    newBattleState.enemyParty.vanguard,
    newBattleState.enemyParty.core,
    newBattleState.enemyParty.support,
  ]){
    for (const beast of array){
      beast.pendingAttacks = []
      const powers = calculateAttack({
        powerSpread,
        beast: beast.beast
      })
      for (const power of powers){
        beast.pendingAttacks.push({
          target: {
            party: 'playerParty',
            partylocation: {
              array: 'vanguard',
              index: 0
            }
          },
          ...power
        })
      }
      console.log("Calculated beast " + beast.beast.uuid)
      setBattleState(JSON.parse(JSON.stringify(newBattleState)))
      await new Promise(resolve => setTimeout(resolve, animationMs));
    }
  }
  
}


async function animateTeamAttacks({
  battleState: battleState,
  setBattleState: setBattleState,
}:{
  battleState: BattleState
  setBattleState: (d: BattleState) => void
}){
  let animatedBattleState = battleState


  for (const array of [
    animatedBattleState.playerParty.vanguard,
    animatedBattleState.enemyParty.vanguard,
    animatedBattleState.playerParty.core,
    animatedBattleState.playerParty.support,
    animatedBattleState.enemyParty.core,
    animatedBattleState.enemyParty.support,
  ]) {
    for (const beast of array) {
      beast.hasAttackedThisTurn = false;
    }
  }

  let nextAttacker = findNextAttacker(animatedBattleState)
  while (nextAttacker){
    animatedBattleState = processBeastAttack({
      battleState: animatedBattleState,
      attacker: nextAttacker,
    })
    nextAttacker = findNextAttacker(animatedBattleState)

    setBattleState(animatedBattleState)
    await new Promise(resolve => setTimeout(resolve, animationMs));
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
  button: {
    backgroundColor: '#2196f3',
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  pressedButton: {
    opacity: 0.7
  },
  text: {
    color: '#fff',
  },
});