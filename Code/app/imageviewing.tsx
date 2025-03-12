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
            <Text style={{color: '#fff'}}>Color1</Text>
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

                <Text style={{color: '#fff'}}>Color2</Text>
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

                <Text style={{color: '#fff'}}>Color3</Text>
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

            <View style={{ margin: '2%', backgroundColor: '#25292e', flex: 1, width: 400, alignItems: 'center', justifyContent: 'center'}}>


                <View style={{backgroundColor: 'white', width: 300, height: 300, borderColor: 'yellow'}}>

                    <TimeBaby 
                        colors={[background, foreground, border]}/>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
