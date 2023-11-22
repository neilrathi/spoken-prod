import {
  usePlayer,
  useStage,
} from "@empirica/core/player/classic/react";
import { Loading } from "@empirica/core/player/react";
import React from "react";
import { Choice } from "./stages/Choice";
import { Result } from "./stages/Result";
import { JoinRoom } from "./stages/JoinRoom";

export function Stage() {
  const player = usePlayer();
  const stage = useStage();
  
  if (player.stage.get("submit")) {
    return (
      <div className="text-center text-gray-400 pointer-events-none">
        Please wait for other player.
      </div>
    );
  }

  switch (stage.get("name")) {
    case "joinroom":
      return <JoinRoom />;
    case "choice":
      return <Choice />;
    case "result":
      return <Result />;
    default:
      return <Loading />;
  }
}