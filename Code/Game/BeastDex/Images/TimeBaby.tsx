import { GameColors } from "@/constants/GameColors";
import Svg, { Circle, Ellipse, Path, Polyline, Rect } from "react-native-svg";

export function TimeBaby({
    colors
}: {
    colors: Array<keyof typeof GameColors>
}) {
    const color1 = colors[0] || 'default'
    const color2 = colors[1] || color1
    const color3 = colors[2] || color2
    const color4 = colors[3] || color3
    return (
        // Settings when building this on boxy-svg.com:
        // viewBox="152.591 292.327 113.929 87.225" width="113.929px" height="87.225px"
        <Svg viewBox="145 235 150 160">
            {/* Body */}
            <Ellipse
                fill={GameColors[color1].background}
                cx="209.942"
                cy="292.755"
                rx="57.198"
                ry="53.272"
            />
            <Rect
                fill={GameColors[color1].background}
                x="152.591"
                y="292.327"
                width="113.929"
                height="87.225" />
            {/* Eyes */}
            <Ellipse 
              cx="181.705" cy="271.13" rx="5.621" ry="6.02"
              fill={GameColors[color2].background}
              strokeWidth="2"
              stroke={GameColors[color2].border}/>
            <Ellipse 
              cx="256.339" cy="271.26" rx="4.989" ry="5.55"
              fill={GameColors[color2].background}
              strokeWidth="2"
              stroke={GameColors[color2].border}/>
            {/* Feet */}
            <Ellipse 
              cx="249.577" cy="381.318" rx="37.958" ry="5.628" 
              fill={GameColors[color2].background}
              strokeWidth="2"
              stroke={GameColors[color2].border}/>
            <Ellipse cx="189.387" cy="380.987" rx="37.958" ry="5.628" 
              fill={GameColors[color2].background}
              strokeWidth="2"
              stroke={GameColors[color2].border}/>

            {/* Clock */}
            <Ellipse cx="219.32" cy="336.676" rx="37.234" ry="37.574" 
                fill={GameColors[color3].background}
                strokeWidth="2"
                stroke={GameColors[color3].border}/>
            <Polyline points="219.854,308.014 220.036,338.055 238.269,338.038" 
                fill="none"
                strokeWidth="2"
                stroke={GameColors[color3].border}/>

            {/* Beak */}
            <Ellipse cx="251.781" cy="293.747" rx="36.817" ry="9.319" 
            fill={GameColors[color4].background}
            strokeWidth="2"
            stroke={GameColors[color4].border}/>
        </Svg>
    );
}
