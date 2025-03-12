import { GameColors } from "@/constants/GameColors";
import Svg, { Circle, Ellipse, Line, Path, Polygon, Polyline, Rect } from "react-native-svg";

export function SpaceBaby({
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
        // viewBox="0 0 500 500"
        <Svg viewBox="0 0 500 500">
            {/* Body & tail fill */}
            <Rect x="228.724" y="159.197" width="121.407" height="91.996" 
              fill={GameColors[color1].background}
              />
            <Rect x="149.312" y="250.8" width="171.035" height="119.772" 
              fill={GameColors[color1].background}
              />
            <Polygon points="149.574,332.157 149.574,359.118 86.887,359.118" 
              fill={GameColors[color1].background}/>
            
            {/* Eyes */}
            <Rect x="326.917" y="186.282" width="19.403" height="19.323" 
              fill={GameColors[color2].background}
              stroke={GameColors[color2].border}
              strokeWidth="2"
              />
            <Rect x="263.564" y="188.155" width="19.403" height="19.323"
              fill={GameColors[color2].background}
              stroke={GameColors[color2].border}
              strokeWidth="2"
              />
            
            {/* Tongue */}
            <Polyline points="348.417,293.377 349,275 357.853,290.691    349,275   345,251.193"
              fill="None"
              stroke={GameColors[color3].background}
              strokeWidth="4"
            />
            
            {/* Ruler marks */}
            <Line 
            x1="319.142" y1="278.361" x2="273.253" y2="278.37"
            stroke={GameColors[color4].background}
            strokeWidth="3"/>
            <Line 
            x1="318.394" y1="323.245" x2="272.505" y2="323.254"
            stroke={GameColors[color4].background}
            strokeWidth="3"/>
            <Line 
            x1="317.675" y1="301.269" x2="302.599" y2="301.449"
            stroke={GameColors[color4].background}
            strokeWidth="3"/>
            <Line 
            x1="317.743" y1="347.267" x2="302.666" y2="347.447"
            stroke={GameColors[color4].background}
            strokeWidth="3"/>

            {/* Head outline */}
            <Polyline 
            points="305.193 250.926 350.119 250.999 349.931 159.28 229.37 159.449 227.629 312.591"
            fill="None"
            stroke={GameColors[color1].border}
            strokeWidth="2"/>
            {/* Body outline & Tail outline */}
            <Polyline 
            points="320.373 251.414 320.392 370.629 149.484 370.721 149.379 250.783 228.454 250.845"
            fill="None"
            stroke={GameColors[color1].border}
            strokeWidth="2"/>
            <Polyline
            points="149.618,332.424 86.895,359.128 149.482,359.247"
            fill="None"
            stroke={GameColors[color1].border}
            strokeWidth="2"/>
        </Svg>
    );
}
