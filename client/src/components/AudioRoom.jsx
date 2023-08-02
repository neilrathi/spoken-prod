import React from "react";
import { useHMSActions } from "@100mslive/react-sdk";

const base =
  "inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-empirica-500";

export function AudioRoom({
  userName,
  roomCode,
  className = "",
}) {
  const hmsActions = useHMSActions();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // use room code to fetch auth token
    const authToken = await hmsActions.getAuthTokenByRoomCode({ roomCode })

    try {
      await hmsActions.join({ userName, authToken });
    } catch (e) {
      console.error(e)
    }
  };

  return (
    <button className={`${base} ${className}`} onClick = {handleSubmit}>
      Join
    </button>
  );
}  