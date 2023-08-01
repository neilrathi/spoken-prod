# spoken-prod
a React component (+ extras) for creating audio calls in Empirica with 100ms.

## dependencies:
* empirica
* 100ms
* axios

## important parts
* `components/AudioRoom.jsx` is _the_ component. it joins a 100ms room given a userName and a roomCode.
* most of the work, though, is done in `callbacks.js`. here, we create a 100ms room for the game, and assign the `roomCode` attribute to all players.
* `stages/Choice.jsx` has a MWE. note critically that upon submitting the form, we also call `hmsActions.leave()` which leaves the room.

questions? email rathi at stanford dot edu :)