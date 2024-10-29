
# Readme for the app folder

Expo router magic finds all files in the /app folder.

I'm not sure what the layout file does, but it seems to be important somehow to make the pages that the router sends you to.

Each page should have the following characteristics:

- If the page uses saved game state (eg, the contents of the box, a dungeonState), 
  then it should have an optional arg for that state and otherwise load the state
  from storage. This lets us run tests without real storage.

- The callback should follow all react callback functions:
    -  React.UseCallback
    -  CancelFunction
    -  Async functions not .then
    -  catch errors on the async function with console.err

- If initial state needs to be created for first time players (or when storage isnt working), write the function to do so in the dedicated file for these functions ( createStartup.ts) 