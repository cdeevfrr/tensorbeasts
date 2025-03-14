# What's this folder?

Skills are split into Support, Vanguard, Core.grouping & Core.attack, and Passive.

Because we want to make it easy to create new skills, we made a framework for skills to work with. You have to understand this framework to understand the code in these directories.

According to the framework, a person writing a new skill must: 
- Define a factory function FactoryArgs -> SerializedShape that creates a JSON object that the skill can use. This JSON (called `payload`) will be saved with eg the beast. The framework will ensure that, from the point of view of the skill writer, your payload is always correctly typed. 
- Define functions for skill execution. For passive skills, this is `activate, deactivate, processStack`; for support, `execute` and `continue`; and so on. These functions all take in as an arg a JSON payload of the type defined above. They typically return a modified battle state.
   - WARNING: if you change the payload type that a skill uses, it may break any old instances of that skill that someone saved (eg a beast acquired before your update). Eg, if boardSize passive skills originally required a size, and now require a dimension instead, that will break things. Do your best to manage your types so this doesn't happen - make your code work with all new or deprecated keys in the payload.
- Register the skill by adding it to the known list (eg the PassiveSkills constant in PassiveSkills.ts)

On the other hand, the framework (eg the rest of the codebase) is responsible for:
- Calling the factory function for your skill when generating a beast or evolving a skill
- Adding a "type" flag to the JSON payload, so we know the correct type to deserialize it as
- Saving the skill payload with the beast in long term storage
- Using the type flag to call the appropriate skill execution functions at the appropriate time, and guaranteeing that the JSON payload is typed as requested in the skill definition

The framework also exposes some helper functions for anyone wanting to create one of many kinds of skills: the `createXXXXSkill` functions (eg `createPassiveSkill`) take in a skill type string and will automatically be type safe (requiring the correct FactoryArgs as a second arg) for any registered skill. Eg, `createPassiveSkill("myPassiveSkillType", {factoryArg1: 2, factoryArg2: 52})` is type-checked as long as you registered `"myPassiveSkillType"` in the PassiveSkillList.

Future plans include ability to upgrade a skill, probably adding a function `upgrade(payload) -> payload`. 