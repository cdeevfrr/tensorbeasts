# What's this folder?

Skills are split into Support, Vanguard, and Core.

Each file contains two things: 
- a function to produce an object of the correct type (eg, produce a support skill) to be saved as JSON with a beast.
- a function to take a dungeonState and a caller monster and to execute the skill (returning the modified dungeon state). 
   - Note that the JSON you get for self (the current skill being executed) may be of an OLD type for that skill. If someone got a beast in v1 with a certain skill, they may use that same beast's skill JSON in v2. 

The idea is that on beast generation or evolution, we'll call the factory function with the current beast params and it'll make a new support skill object that will be saved in that beast's skills.

Then, when actually executing the skill, we'll use a common codebase for one skill type, but use the JSON blob associated with that beast as the inputs (eg, changing the damage of the skill or similar).