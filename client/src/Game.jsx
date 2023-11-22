import { useGame, usePlayer, useStage } from "@empirica/core/player/classic/react";

import React from "react";
import { Profile } from "./Profile";
import { AudioRoom } from "./components/AudioRoom";
import { Options } from "./components/Options";

export function Game() {

  const stage = useStage()
  const game = useGame()
  const player = usePlayer()
  console.log(game.get("roomCode"))

  // suppress images when player is ready to go to next round
  const options = (stage.get("name") == "result" & player.stage.get("submit")) ? null :
    (stage.get("name") == "joinroom") ? <AudioRoom userName = {player.id} roomCode = {player.get("roomCode")} forceJoin = {false}/> : <Options />

  return (
    <div className="h-full w-full flex">
      <div className="h-full w-full flex flex-col">
        <Profile />
        <div className="h-full flex items-center justify-center">
          {options}
        </div>
      </div>

    </div>

    
  );
}
