import { Beast } from "@/Game/Beasts/Beast"
import { BeastC } from "./BeastC"

export function BoxC({box}:{box: Array<Beast>}){
    {box.map((beast) => {
        return <BeastC 
          beast={beast} 
          beastClickCallback={()=> {}}
          key={beast && beast.uuid}/>
    })}
}