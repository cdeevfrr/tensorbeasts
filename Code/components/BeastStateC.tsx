import { GameColors } from "@/constants/GameColors";
import { BeastState } from "@/Game/Battle/BeastState";
import { useState } from "react";
import { Pressable, View } from "react-native";
import Svg, { Rect, Text } from "react-native-svg";
import { BeastDetailModal } from "./BeastDetailModal";

export function BeastStateC({
    beast,
    beastClickCallback
}: {
    beast: BeastState
    beastClickCallback: (beast: BeastState) => any
}){
    const [showDetail, setShowDetail] = useState(false)

    const maxCharge = beast.beast.supportSkills
        .map(skill => skill.chargeRequirement)
        .reduce((a, b) => Math.max(a, b), 0)
    
    return <View>
      <Pressable 
        onPress={() => beastClickCallback(beast)}
        onLongPress={() => {
            console.log("Long press!")
            setShowDetail(true)
        }}>
      <Svg 
        height="50%" 
        width="50%" 
        viewBox="0 0 100 100"
    >
        <Rect 
            x="15"
            y="15"
            width="70"
            height="70"
            stroke="red"
            strokeWidth="2"
            fill={beast.beast.colors?.[0] ?
                GameColors[beast.beast.colors[0]].background 
                : GameColors['default'].background}
        />

        {/* Health bar */}
        <Rect
            x="20"
            y="65"
            width="60"
            height="5"
            stroke="grey"
            strokeWidth="0.2"
            fill="grey"
        />
        <Rect
            x="20"
            y="65"
            width={ Math.floor(beast.currentHP / beast.maxHP * 60)}
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
                return <Rect
                    key={index}
                    x={Math.floor(skill.chargeRequirement / maxCharge * 60) + 20}
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