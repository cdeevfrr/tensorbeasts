// Form a group when a continuous block of the same 
// color/number/shape is of size greater than (quality).

import { accessLocation, Location, locationsIter } from "@/Game/Battle/Board";
import { GroupSkillBlueprint } from "./CoreGroupSkillBlueprint";
import { doesMatch, Match } from "@/Game/Beasts/Match";
import * as GroupingUtil from "./GroupingUtils";


export const ContinuousThreeGroup: GroupSkillBlueprint = {
    factory: () => {
        return {
            name: "Exactly 3, same color, touching (no diagonals)",
            type: "ContinuousThree"
            // TODO: matcher: ["color"] or ["color", "shape"] or ["number", "shape"] or similar.
        }
    },
    nextGroup: (self, board) => {
        const seen = new Set<Location>()

        for (const location of locationsIter(board)){
            if (!seen.has(location)){
                const initialBlock = accessLocation(location, board)
                const match: Match = {
                    color: initialBlock?.color
                }
                const expanded = GroupingUtil.expandBorder({
                    board,
                    initialToVisit: [location],
                    matches: ({block}) => {
                        return doesMatch(block, match)
                    },
                    maxSize: 3,
                })
                if (expanded.length >= 3){
                    return expanded
                } else {
                    for (const location of expanded) {
                        seen.add(location)
                    }
                }
            }
        }
        return undefined
    }
}