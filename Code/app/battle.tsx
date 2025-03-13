import { BeastStateRowC } from '@/components/BeastStateRowC';
import { BlockBoardC } from '@/components/BlockBoardC';
import { SkillSelectModal } from '@/components/SkillSelectModal';
import { StackC } from '@/components/StackC';
import { SupportSkill } from '@/Game/SkillDex/Support/SupportSkill';
import { BeastState } from '@/Game/Battle/BeastState';
import { addCharge, addGroupingBeast, BattleState, continueSkill, destroyBlocks, fall, findBeast, findNextAttacker, lost, processBeastAttack, useSkill, won } from '@/Game/Battle/BattleState';
import { useRef, useState } from 'react';
import { Text, View, StyleSheet, Button, Alert, Modal, Pressable, Animated } from 'react-native';
import { ConfirmCoreModal } from '@/components/ConfirmCoreModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { battleStateKey } from '@/constants/GameConstants';
import { BattleOverModal } from '@/components/BattleOverModal';
import { DiedModal } from '@/components/DiedModal';
import { useFocusEffect } from 'expo-router';
import React from 'react';
import { CoreGroupSkills } from '@/Game/SkillDex/Core/GroupCriteria/CoreGroupSkillList';
import { Block } from '@/Game/Battle/Block';
import { Location } from '@/Game/Battle/Board';


// There's lots of states here.
// 
// The important one is the main attack flow.
// 
// This goes through states:
// - initial (nothing done yet)
// - You clicked attack, pick a core beast
// - You clicked a core beast, are you sure?
// - Grouping state (skills still usable)
// - Do it! (attacks occur)
// - Back to initial
//
// In the grouping state, the core beast's grouping effect will take over
// & play an animation any time a group is found (which can be on first entry, or on skill use.)
// 
// We detect if we're in the grouping state by battleState.groupingBeast not being undefined.
// 
// We use two kinds of isAnimating flags to prevent all user input.
// 
// This is because isGroupAnimating relies on recursive renders to eventually
// be turned to false; but the normal isAnimating flag should be turned off
// by whatever turned it on.
type attackFlowState = {
  state: 'initial' | 'pickCore',
  coreBeast?: BeastState,
}

const animationMs = 300
const groupAnimationMs = 1000

const runningChargeInterval: {interval: null | NodeJS.Timeout} = {
  interval: null
}

export default function BattleScreen({
  presetState
}: {
  presetState: BattleState
}) {
  const [selectedSupportBeast, setSelectedSupportBeast] = useState<BeastState | null>(null)
  const [battleState, setBattleState] = useState<BattleState | undefined>(presetState)
  const [attackFlowState, setAttackFlowState] = useState<attackFlowState>({state: 'initial'})

  // Normal animations. Eg animations showing the damage done to each beast.
  const [isAnimating, setIsAnimating] = useState(false)
  // Something triggered grouping & falling, this indicates
  // we're animating that and users shouldn't interact. It's harder to know when to turn
  // this one off.
  const [isGroupAnimating, setIsGroupAnimating] = useState(false)
  const groupAnimationPercentage = useRef(new Animated.Value(0));
  // Used for one piece of group animating.
  const [isSubGroupAnimating, setIsSubGroupAnimating] = useState(false);
  const [animatingToBattleState, setAnimatingToBattleState] = useState<BattleState | null>(null);


  const animationFlag = isAnimating || isGroupAnimating || isSubGroupAnimating
  // Loading behavior common to all top level pages, loads battleState.
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


  const chooseSupportSkillCallback = (beast: BeastState) => {
    setSelectedSupportBeast(beast)
  };
  const useSkillCallback = (beast: BeastState, skill: SupportSkill) => {
    const newState = useSkill(battleState, beast, skill)
    // TODO: Animate something.
    setBattleState(newState)
    if (newState.groupingBeast){
      setIsGroupAnimating(true)
    }
  }

  // If the user just clicked to use a skill, and that skill has block selection in it,
  // add the appropriate block callback.
  let blockCallback: null | ((block: Block | null, location: Location) => void) = null
  if (!animationFlag && battleState.processingSkill) { 
      const uuid = battleState.processingSkill.beastUUID
      const skillNum = battleState.processingSkill.skillNum
      blockCallback = (block: Block | null, location: Location) => {
        const beast = findBeast(battleState, {beast: {uuid}})
        if (!beast){
          const reRenderState = {
            ...battleState
          }
          delete reRenderState.processingSkill
          setBattleState(reRenderState)
        } else {
          const skill = beast.beast.supportSkills[skillNum]
          const newState = continueSkill(battleState, beast, skill, location)
          setBattleState(newState)
          if (newState.groupingBeast){
            setIsGroupAnimating(true)
          }
        }
    }
  }

  const finishGroupAnimating = () => {
    setIsGroupAnimating(false)
    // TODO: save battle state to async storage.
  }

  const animateTo = async (toState: BattleState, duration: number) => {
    return new Promise(resolve => {
      setAnimatingToBattleState(toState)
      groupAnimationPercentage.current.resetAnimation()
      Animated.timing(groupAnimationPercentage.current, {
        toValue: 1,
        duration,
        useNativeDriver: false,
      }).start(() => {
        setAnimatingToBattleState(null)
        setBattleState(toState)
        groupAnimationPercentage.current.resetAnimation()
        resolve(null)
      })
    })
  }

  // This group animations block has a lot of logic to cause events (eg fall) and re-rendering.
  // If you enter this `if` block, users cannot interact with the app until 
  // you call finishAnimating (which is the only way to set isGroupAnimating to false).
  // If isSubGroupAnimating, then there should be an async process that will cause a re-render later, 
  // you shouldn't need to actively call finishAnimating yourself.
  if(isGroupAnimating && !animatingToBattleState && !isSubGroupAnimating){
    if (!battleState.groupingBeast || !battleState.groupingBeast.coreGroupSkill){
      finishGroupAnimating()
    } else {
      // In this state, users should't be able to click anything. They're forced to
        // wait for the animations that destroy blocks, which then triggers
        // re-grouping; until we setGroupAnimating(false) (by calling finishAnimating)
      // This else block represents one 'fall' event. Multiple falls may occur, causing
      // re-rendering, before we finishAnimating.
      //
      // Game plan: 
      // Calculate battleStates for each group found, and a fallen battle state.
      // Animate between each state while keeping isGroupAnimating true.
      // Only finishAnimating if no groups were found at all.
      const serializedSkill = battleState.groupingBeast.coreGroupSkill
      const skillBlueprint = CoreGroupSkills[serializedSkill.type]

      const animateStates = [battleState]

      let nextGroup = skillBlueprint.nextGroup(serializedSkill, animateStates[animateStates.length - 1].board)
      while (nextGroup) {
        animateStates.push(destroyBlocks({
          battleState: animateStates[animateStates.length - 1], 
          locations: nextGroup, 
          clone: true,
          shouldFall: false,
        }))
        nextGroup = skillBlueprint.nextGroup(serializedSkill, animateStates[animateStates.length - 1].board)
      }

      if (animateStates.length === 1){
        // We didn't find any groups, so group animating is done!
        finishGroupAnimating()
      } else {
        animateStates.push(fall(animateStates[animateStates.length - 1]))

        const duration = Math.min(
          3000,
          Math.floor(groupAnimationMs / ( (battleState.stack.length + 3) / 30))
        )

        if (duration > 1000){ // animate all transitions
          setIsSubGroupAnimating(true);
          // Have to await animateTo here so that we go one animation at a time,
          // instead of firing them all at once.
          (async () => {
            for (let toStateIndex = 1; toStateIndex < animateStates.length; toStateIndex ++){
              const toState = animateStates[toStateIndex]
              await animateTo(toState, Math.floor(duration / animateStates.length))
            }
            setIsSubGroupAnimating(false)
          })()
        } else if (duration > 100) { // low duration, only animate directly to the end.
          animateTo(animateStates[animateStates.length - 1], duration)
        } else { // duration is VERY small, no animations - just jump straight to the end after a small ms delay.
          setTimeout(() => {
            setBattleState(animateStates[animateStates.length - 1])
          }, duration)
        }
      }
    }
  }

  return (
    <View style={styles.container}>
      {/* This modal just prevents clicks during animations */}
      <Modal 
        transparent={true}
        visible={isAnimating || isGroupAnimating}
      />
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
          <BlockBoardC 
              board={battleState.board} 
              blockCallback={blockCallback}
              boardTo={animatingToBattleState? animatingToBattleState.board : undefined}
              animationPercent={groupAnimationPercentage.current}/>
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
                    state: 'initial',
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
                  chooseSupportSkillCallback : 
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
          {/* Attack button to begin attack/match phase*/}
          {attackFlowState.state == 'initial' && ! battleState.groupingBeast && <Button 
            title={"Attack"} 
            onPress={() => {
              setAttackFlowState({state: 'pickCore'})
              }}/>
            }
          {/* Do it button (completes attack) */}
          {battleState.groupingBeast !== undefined && <Button 
            title={"Do it!"} 
            onPress={async () => {
              setIsAnimating(true)
              const newBattleState = await animateTeamAttacks({
                battleState,
                setBattleState,
              })
              setAttackFlowState({
                state: 'initial'
              })
              delete newBattleState['groupingBeast']
              setBattleState({
                ...newBattleState,
                stack: []
              })
              // TODO: Save battle state to async storage
              setIsAnimating(false)
              }}/>
            }
          {/* Charge button */}
          {attackFlowState.state == 'initial' && !battleState.groupingBeast && <Pressable
              onPressIn={(e) => {
                runningChargeInterval.interval = setInterval(
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
                runningChargeInterval.interval &&
                clearInterval(runningChargeInterval.interval)
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
        beast={selectedSupportBeast}
        onRequestClose={() => setSelectedSupportBeast(null)}
        useSkill={useSkillCallback}
        visible={!!selectedSupportBeast}
      />
      {/* this modal needs to be rendered conditionaly because it takes a non-null beast.*/}
      {attackFlowState.coreBeast && <ConfirmCoreModal
        // We know coreBeast isn't undefined in this state. 
        beast={attackFlowState.coreBeast as BeastState}
        onRequestClose={() => setAttackFlowState({state: 'initial'})}
        onRequestConfirm={async () => {
            // This relies on the react behavior of batching state updates.
            setIsGroupAnimating(true)
            setAttackFlowState({
              state: 'initial'
            })
            setBattleState(addGroupingBeast(
              battleState, 
              (attackFlowState.coreBeast as BeastState).beast)
            )
        }}
        visible={attackFlowState.coreBeast !== undefined}
      />}
      {won(battleState) && // This check prevents calculating levelups every render.
        <BattleOverModal
          visible={won(battleState)}
          battleState = {battleState}/>}
      {lost(battleState) && <DiedModal visible={true}/>}
    </View>
  );
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

  return animatedBattleState
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#25292e',
  },
  leftBlock: {
    flex: 3,
    maxHeight: '95%',
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