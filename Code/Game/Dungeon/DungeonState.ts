import { addLocations, Location, negateLocation } from "../Battle/Board";
import { PartyPlan } from "../Beasts/PartyPlan";
import { beginnerDungeon } from "../DungeonMap/BeginnerDungeon";
import { DungeonMap, findMap } from "../DungeonMap/DungeonMap";
import { expandingDungeon } from "../DungeonMap/ExpandingDungeon";
import { intermediateDungeon } from "../DungeonMap/IntermediateDungeon";
import { Party, toParty } from "./Party";

export interface DungeonState {
    party: Party,
    location: Location,
    spoils: any,
    map: DungeonMap,
    // Player has actually been to this location
    visited: Array<Location>,
    // Player has seen this location (possibly due to render distance, possibly because visited.)
    seen: Array<Location>,
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
        visited: [[0,0,0,0,0]],
        seen: [[0,0,0,0,0]],
    }
}
const maps = [
    beginnerDungeon,
    intermediateDungeon,
    expandingDungeon,
]

export function loadDungeon(savedData: string){
    const partial = JSON.parse(savedData) as DungeonState
    
    partial.map = findMap(partial.map)
    
    return partial
}

export function updateSeen(d: DungeonState, distance: number, travellableDimensions: Array<boolean>){
    updateSeenRecursive(d, distance, travellableDimensions, d.location, new Set())
}

function updateSeenRecursive(
    d: DungeonState, 
    distance: number, 
    travellableDimensions: Array<boolean>, 
    currentLocation: Location,
    considered: Set<string>){

        if (!d.seen.some((x) => JSON.stringify(x) === JSON.stringify(currentLocation))){

            d.seen.push(currentLocation)
        }


        const considerLocation = (newLocation: Array<number>) => {

            considered.add(JSON.stringify(newLocation))

            const tile = d.map.getTileAt({location: newLocation})

            if (tile.opaque){
                // If opaque, add to seen & stop recursion.
                if (!d.seen.includes(newLocation)){

                    d.seen.push(newLocation)
                }
            } else {

                // if not opaque, recurse
                updateSeenRecursive(
                    d,
                    distance - 1,
                    travellableDimensions,
                    newLocation,
                    considered
                )
            }
        }

        if (distance >= 2) {
            for (let direction = 0; direction < travellableDimensions.length; direction++){
                if (travellableDimensions[direction]){
    
                    const toAdd = [0,0,0,0,0]
    
                    toAdd[direction] = 1
                    const newLocation = addLocations(currentLocation, toAdd)
    
                    if (!considered.has(JSON.stringify(newLocation))) {
                        considerLocation(newLocation)
                    }
                    
                    const newLocation2 = addLocations(currentLocation, negateLocation(toAdd))
                    if (!considered.has(JSON.stringify(newLocation2))) {
                        considerLocation(newLocation2)
                    }
                }
            }
        }
}