import { DungeonState } from "@/Game/Dungeon/DungeonState";
import { View, StyleSheet } from "react-native";
import { BlockC } from "./BlockC";

export function BlockBoardC({board}: {board: DungeonState["board"]}){
    const xPlanes = [...board.blocks]
    xPlanes.reverse()
    return <View style={styles.container}>
        {xPlanes.map((xHyperplane) => {
            const y = 0
            const z = 0
            const a = 0
            const b = 0
            const block = xHyperplane[y][z][a][b]
            return <BlockC dungeonBlock={block}/>
        })}
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        justifyContent: 'center',
        alignItems: 'center',
    },
});