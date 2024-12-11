import { Location } from "../Battle/Board";
import { DungeonMap } from "./DungeonMap";
import { boxTileImage } from "./Images";
import { Tile } from "./Tile";

export const expandingDungeon: DungeonMap = {
    id: 'expandingDungeon',
    getBattleAt: getBattleAt,
    getTileAt: getTileAt,
}

function getBattleAt({location}: {location: Location}) {
    return []
} 

function getTileAt({location}: {location: Location}): Tile {
    return {
        image: () => boxTileImage({foreground: 'red', background: 'brown'}),
        opaque: false,
        walkable: true,
    }
} 