import { usePlayer, useStage } from "@empirica/core/player/classic/react";

import React from "react";
import { Profile } from "./Profile";
import { Options } from "./components/Options";

export function Game() {

  const stage = useStage()
  const player = usePlayer()

  // suppress images when player is ready to go to next round
  const options = (stage.get("name") == "result" & player.stage.get("submit")) ? null : <Options />

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
