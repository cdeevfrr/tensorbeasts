import { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { TimeBaby } from "@/Game/BeastDex/Images/TimeBaby";
import { GameColors } from "@/constants/GameColors";


const options = Object.keys(GameColors) as Array<keyof typeof GameColors>

export default function Index() {
    const [background, setBackground] = useState<keyof typeof GameColors>(1);
    const [foreground, setForeground] = useState<keyof typeof GameColors>(1);
    const [border, setBorder] = useState<keyof typeof GameColors>(1);

    return (

        <View
            style={styles.container}
        >
            <View style={{ margin: '2%', backgroundColor: 'white', flex: 1}}>
                
                <Text>Background</Text>
                <select 
                value={background} 
                onChange={
                    (e) => 
                    setBackground(e.target.value as keyof typeof GameColors)
                }>
                    {options.map(color => {
                        return <option value={color}>{color}</option>
                    })}
                </select>

                <Text>Foreground</Text>
                <select 
                value={foreground} 
                onChange={
                    (e) => 
                    setForeground(e.target.value as keyof typeof GameColors)
                }>
                    {options.map(color => {
                        return <option value={color}>{color}</option>
                    })}
                </select>

                <Text>Border</Text>
                <select 
                value={border} 
                onChange={
                    (e) => 
                    setBorder(e.target.value as keyof typeof GameColors)
                }>
                    {options.map(color => {
                        return <option value={color}>{color}</option>
                    })}
                </select>


                <View style={{backgroundColor: 'white', width: 300}}>

                    <TimeBaby 
                        background={background} 
                        foreground={1} 
                        border={1}/>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
