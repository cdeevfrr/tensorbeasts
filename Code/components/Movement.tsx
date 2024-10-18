import { Location } from "@/Game/Battle/Board";
import { View, StyleSheet, Text, Button } from "react-native";


export function Movement({
    dimensions,
    moveCallback,
}:{
    // Which dimensions can the user currently move in?
    dimensions: Array<boolean>
    // the move callback returns periodic vectors to add to current position.
    // Eg, if the user clicked x+ and z-, 
    // it might be called with [1, 0, -1, 0, 0]
    // or be called twice with [1, 0, 0, 0, 0] and [0, 0, -1, 0, 0]
    moveCallback: (l: Location) => void
}) {
    let i = -1
    let labels = ['x', 'y', 'z', 'a', 'b']
    return <View style={styles.container}>
        {dimensions.map((active, index) => {
            i += 1

            const up = [0,0,0,0,0]
            const down = [0,0,0,0,0]
            up[i] += 1
            down[i] -= 1
            return active && <View 
              style={styles.arrowContainer} 
              key={index} // Safe in this case because each sub-component has no state.
            >
                <Text style={styles.text}>{labels[i]}</Text>
                <Button
                    title="^"
                    onPress={() => {
                        moveCallback(up)}
                    }
                />
                <Button
                    title="V"
                    onPress={() => {
                        moveCallback(down)}
                    }
                />
            </View>
        })}
    </View>
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row', // Arrange children horizontally
      justifyContent: 'flex-start',
      alignItems: 'center', // Center vertically
    },
    arrowContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#fff',
    },
  });