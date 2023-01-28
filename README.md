# 🐾 tinsy

A JSON format for creating [Bitsy](http://bitsy.org) games. The program converts the [JSON](https://www.json.org) into valid Bitsy game data using separately provided "textures".

## Status

_Not in development._

This was a quick weekend project to see if I could get [ChatGPT](https://chat.openai.com) to generate Bitsy games. (In the end, it ever generated a complete JSON object before ending it's response.)

If this is an idea you'd want to run with, by all means take the code and run! (or start afresh, it's not necessarily the best code). Something like this would probably work well with [Tracery](https://www.tracery.io/)

### Issues

-   No error checking/reporting when JSON input is invalid
-   No UI for inputting JSON
-   No UI for inputting textures

### Unsupported Bitsy features

-   Items
-   Animations
-   Dialogue formatting
-   "Ending" exists
-   Complex dialogue features
-   Exit dialogues
-   Variables
-   Different avatar sprites in different rooms
-   Music tracks
-   Sound effects
