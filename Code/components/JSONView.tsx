import { ScrollView, StyleSheet, Text } from "react-native";

export function JSONView({json}:{json: any}){
    return <ScrollView style={styles.scrollViewContainer}>
        <Text style={styles.text}>{JSON.stringify(json, null, 30)}</Text>
    </ScrollView>
}

const styles = StyleSheet.create({
    scrollViewContainer: {
      flex: 1,
      backgroundColor: '#25292e',
      margin: '2%',
    },
    text: {
        color: '#fff',
    },
})