import Svg, { Rect } from "react-native-svg";

export function BeastStateC(props: {beast: BeastState}){
    return <Svg height="50%" width="50%" viewBox="0 0 100 100">
        <Rect
            x="15"
            y="15"
            width="70"
            height="70"
            stroke="red"
            strokeWidth="2"
            fill="yellow"
        />
    </Svg>
}