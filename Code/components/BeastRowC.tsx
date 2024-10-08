import { BeastStateC } from "./BeastStateC"

export function BeastRowC(props: {beasts: Array<BeastState>}){
    return props.beasts.map(beast => {
        return <BeastStateC beast={beast}/>
    })
}