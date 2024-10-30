import { FiveDContainer } from '@/components/FiveDContainer';
import { Text, View, StyleSheet } from 'react-native';

export default function BeastScreen() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Beast screen</Text>
        <FiveDContainer
          elements={[
            {
              component: <View style={styles.test}><Text>Hi</Text></View>,
              location: [1,0,0,0,0],
            },
            {
              component: <View style={styles.test}><Text>Hi</Text></View>,
              location: [2,0,0,0,0],
            },
            {
              component: <View style={styles.test}><Text>Hi</Text></View>,
              location: [3,0,0,0,0],
            },
            {
              component: <View style={styles.test}><Text>Hi</Text></View>,
              location: [1,1,0,0,0],
            },
            {
              component: <View style={styles.test}><Text>There</Text></View>,
              location: [1,1,1,1,0],
            },
            {
              component: <View style={styles.test}><Text>Bob</Text></View>,
              location: [1,1,1,0,0],
            },
            {
              component: <View style={styles.test}><Text>There2</Text></View>,
              location: [1,1,1,0,1],
            },
            {
              component: <View style={styles.test}><Text>There2</Text></View>,
              location: [1,1,1,1,1],
            },
          ]}
        />
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
test: {
  backgroundColor: 'blue',
  margin: '5%',
  color: 'Red',
  borderColor: 'green'
}
});