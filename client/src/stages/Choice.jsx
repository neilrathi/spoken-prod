import React from "react";
import { AudioRoom } from "../components/AudioRoom";
import { usePlayer } from "@empirica/core/player/classic/react";
import { Button } from "../components/Button";
import { useEffect } from "react";
import { useHMSActions } from "@100mslive/react-sdk";

export function Choice() {
  const player = usePlayer();
  const hmsActions = useHMSActions();

  function onClick(choice) {
    player.round.set("decision", choice);
    player.stage.set("submit", true);
    hmsActions.leave();
  }

  return (
    <div>
      <h2>This is a round</h2>
      <ul className="list-disc list-inside">
        <li>
          Here's an instruction.
        </li>
        <li>
          Here's another instruction.
        </li>
      </ul>
      <br />
      <p>Join the room?</p>

      <div className="flex justify-center m-5">
        <AudioRoom userName = {player.id} roomCode = {player.get("roomCode")} className="m-5"/> <br />
        <Button className="m-5" handleClick={() => onClick("a")}> Option A </Button>
        <Button className="m-5" handleClick={() => onClick("b")}> Option B </Button>
      </div>
    </div>
  );
}