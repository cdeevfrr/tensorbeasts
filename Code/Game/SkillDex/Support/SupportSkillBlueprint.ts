import { SupportSkill } from "./SupportSkill"
import { BeastState } from "../../Dungeon/BeastState"
import { DungeonState } from "../../Dungeon/DungeonState"

export interface SkillBlueprint {
    factory: (props: any) => Omit<SupportSkill, 'type'>
    execute: (self: SupportSkill, dungeonState: DungeonState, caller: BeastState, props: any) => DungeonState
}