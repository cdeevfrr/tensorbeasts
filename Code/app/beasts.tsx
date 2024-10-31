import { BoxC } from '@/components/BoxC';
import { boxKey } from '@/constants/GameConstants';
import { Beast } from '@/Game/Beasts/Beast';
import { createBox } from '@/Game/createStartup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function BeastScreen({
  initialBox
}:{
  initialBox?: Array<Beast>
}) {
  const [box, setBox] = useState<Array<Beast>>(initialBox || [])

  useFocusEffect(React.useCallback(() => {
    let isActive = true
    const cancelFunction = () => {
      isActive = false
    }

    const callback = async () => {
      if (!initialBox){
        const boxString = await AsyncStorage.getItem(boxKey)
  
        if (!boxString){
          const box = await createBox()
          if (isActive){
            setBox(box)
          }
        } else {
          if (isActive){
            setBox(JSON.parse(boxString))
          }
        }
      }
    }

    callback().catch(console.error)

    return cancelFunction
  }, []))

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Beast screen</Text>
      <View style={styles.boxContainer}>
        <BoxC
          box={box}
          canSelectNull={false}
          beastClickedCallback={
            // TODO: Make this do something like enhancing or something.
            () => {}
          }
        />
      </View>
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
boxContainer: {
  flex: 8,
  width: '50%',
  alignItems: 'stretch',
  backgroundColor: 'grey',
},
text: {
    color: '#fff',
},
test: {
  backgroundColor: 'blue',
  margin: '5%',
  color: 'Red',
  borderColor: 'green'
}
});