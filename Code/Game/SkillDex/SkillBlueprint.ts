import { DungeonState } from "../Dungeon/DungeonState"

export interface SkillBlueprint {
    factory: (props: any) => SupportSkill
    execute: (self: SupportSkill, dungeonState: DungeonState, caller: Beast, props: any) => DungeonState
}