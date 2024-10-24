import { Location } from "../Battle/Board";
import { PartyPlan } from "../Beasts/PartyPlan";
import { beginnerDungeon } from "../DungeonMap/BeginnerDungeon";
import { DungeonMap, findMap } from "../DungeonMap/DungeonMap";
import { intermediateDungeon } from "../DungeonMap/IntermediateDungeon";
import { Party, toParty } from "./Party";

export interface DungeonState {
    party: Party,
    location: Location,
    spoils: any,
    map: DungeonMap,
    // TODO: remove runComplete, use battleState.lost(party), if it's even needed at all.
    runComplete: boolean,
    seen: Array<Location>
}


export async function generateNewDungeonRun({
    partyPlan,
    dungeonMapNumber
}:{
    partyPlan: PartyPlan,
    dungeonMapNumber: number,
}): Promise<DungeonState>{
    return {
        party: toParty(partyPlan),
        location: [0,0,0,0,0],
        spoils: [],
        map: maps[dungeonMapNumber - 1],
        runComplete: false,
        seen: [[0,0,0,0,0]],
    }
}
const maps = [
    beginnerDungeon,
    intermediateDungeon
]

export function isRunComplete(d: DungeonState){
    return d.runComplete
}

export function loadDungeon(savedData: string){
    const partial = JSON.parse(savedData) as DungeonState
    
    partial.map = findMap(partial.map)
    
    return partial
}