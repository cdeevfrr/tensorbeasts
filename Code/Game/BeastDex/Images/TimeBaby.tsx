import { GameColors } from "@/constants/GameColors";
import Svg, { Circle, Ellipse, Path } from "react-native-svg";

export function TimeBaby({
    background, 
    foreground, 
    border
}: {
    background: keyof typeof GameColors, 
    foreground: keyof typeof GameColors,
    border: keyof typeof GameColors,
}) {
    return (
        <Svg viewBox="0 0 100 100">
            {/* Body */}
            <Ellipse
                cx="50"
                cy="60"
                rx="25"
                ry="30"
                fill={GameColors[background].background}
                stroke={GameColors[border].border}
                strokeWidth="2"
            />
            {/* Head */}
            <Circle 
                cx="50"
                cy="40"
                r="15"
                fill={GameColors[background].background}
                stroke={GameColors[border].border}
                strokeWidth="2"
            />
            {/* Eye */}
            <Circle 
                cx="55"
                cy="35"
                r="3"
                fill={GameColors[foreground].text}
            />
            {/* Beak */}
            <Path 
                d="M 60 38 Q 70 40, 60 42"
                fill="none"
                stroke={GameColors[foreground].text}
                strokeWidth="2"
            />
            {/* Feet */}
            <Path 
                d="M 40 85 Q 45 90, 50 85"
                fill="none"
                stroke={GameColors[border].border}
                strokeWidth="2"
            />
            <Path 
                d="M 50 85 Q 55 90, 60 85"
                fill="none"
                stroke={GameColors[border].border}
                strokeWidth="2"
            />
        </Svg>
    );
}
