import Svg, { Rect } from "react-native-svg";


export function boxTileImage({foreground, background}: {foreground: string, background: string}){
    return <Svg viewBox="0 0 100 100">
        <Rect
          x='10'
          y='10'
          width='80'
          height='80'
          stroke={foreground}
          strokeWidth='2'
          fill={background}
        />
    </Svg>
}

export function grassTileImage({foreground, background}: {foreground: string, background: string}){

}

export function treeTileImage({foreground, background}: {foreground: string, background: string}){

}