import { BeastState } from "@/Game/Dungeon/BeastState";
import Svg, { Rect } from "react-native-svg";

export function BeastStateC({
    beast,
    beastClickCallback
}: {
    beast: BeastState
    beastClickCallback: (beast: BeastState) => any
}){
    const maxCharge = beast.beast.supportSkills
        .map(skill => skill.chargeRequirement)
        .reduce((a, b) => Math.max(a, b), 0)
    
    return <Svg height="50%" width="50%" viewBox="0 0 100 100">
        <Rect onPress={() => beastClickCallback(beast)}
            x="15"
            y="15"
            width="70"
            height="70"
            stroke="red"
            strokeWidth="2"
            fill="yellow"
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
            beast.beast.supportSkills.map(skill => {
                return <Rect
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
    </Svg>
}