import { GameColors } from "@/constants/GameColors";
import { BeastState } from "@/Game/Battle/BeastState";
import { useState } from "react";
import { Pressable, View, StyleSheet } from "react-native";
import Svg, { Rect, Text } from "react-native-svg";
import { BeastDetailModal } from "./BeastDetailModal";

export function BeastStateC({
    beast,
    beastClickCallback,
    minimize
}: {
    beast: BeastState
    beastClickCallback: (beast: BeastState) => any,
    minimize?: boolean
}){
    const [showDetail, setShowDetail] = useState(false)

    const maxCharge = beast.beast.supportSkills
        .map(skill => skill.chargeRequirement)
        .reduce((a, b) => Math.max(a, b), 0)
    
    return <View style={minimize? StyleSheet.flatten([styles.container, {maxWidth: 30} ]): styles.container}>
        <Pressable 
        style={styles.pressable}
        onPress={() => beastClickCallback(beast)}
        onLongPress={() => {
            setShowDetail(true)
        }}>
    <Svg 
        style={styles.svg}
        viewBox="0 0 100 100"
    >
        {/* <Rect width='100%' height='100%' fill='yellow'></Rect> */}
        <Rect 
            x="0"
            y="0"
            width="98"
            height="98"
            stroke="red"
            strokeWidth="2"
            fill={beast.beast.colors?.[0] ?
                GameColors[beast.beast.colors[0]].background 
                : GameColors['default'].background}
        />

        {/* Health bar */}
        <Rect
            x="5"
            y="65"
            width="90"
            height="5"
            stroke="grey"
            strokeWidth="0.2"
            fill="grey"
        />
        <Rect
            x="5"
            y="65"
            width={ Math.floor(beast.currentHP / beast.maxHP * 90)}
            height="5"
            stroke="grey"
            strokeWidth="0.2"
            fill="green"
        />

        {/* Charge bar */}
        {maxCharge > 0 && <Rect
            x="20"
            y="75"
            width="60"
            height="5"
            stroke="grey"
            strokeWidth="0.2"
            fill="grey"
        />}
        {maxCharge > 0 && <Rect 
            x="20"
            y="75"
            width={ Math.floor(beast.currentCharge / maxCharge * 60)}
            height="5"
            stroke="grey"
            strokeWidth="0.2"
            fill="green"
        />}
        {
            beast.beast.supportSkills.map((skill, index)=> {
                const x = Math.floor(skill.chargeRequirement / maxCharge * 60) + 20

                return <Rect
                    key={index}
                    x={x}
                    y="75"
                    width="2"
                    height="5"
                    stroke="grey"
                    strokeWidth="0.2"
                    fill="yellow"
                />
            })
        }

        {beast.pendingAttacks && beast.pendingAttacks.map((atk, index) => {
            const preDefDamage = atk.power * beast.beast.baseAttack
            return <Text 
              x="20" 
              y={"" + (40 + index * 5)}
              fill={atk.match.color? GameColors[atk.match.color].border: "black"}
              key={index}>
                {preDefDamage > 1000? preDefDamage.toExponential() : preDefDamage}
            </Text>
        })}
      </Svg>
    </Pressable>
       {showDetail && 
        <BeastDetailModal 
          beast={beast}
          onRequestClose={() => setShowDetail(false)}
          visible={true}
        />
      }
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // Need a maxHeight here to bound the views inside their row.
        maxHeight: '100%',
        // TODO: setting maxWidth is a hack. Find some other way
        // to tell the styling that each beast SVG should only be
        // as wide as it is tall.
        maxWidth: 80,
        margin: 5,
    },
    pressable: {
        flex: 1,
        flexDirection: 'row',
    },
    svg: {
        flex: 1,
    }
})