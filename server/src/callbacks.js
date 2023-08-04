import { ClassicListenersCollector } from "@empirica/core/admin/classic";
import axios from 'axios'
import jwt from 'jsonwebtoken';
import uuid4 from 'uuid4';
export const Empirica = new ClassicListenersCollector();

Empirica.on("batch", "status", (ctx, { batch, status }) => {
  console.log(`Batch ${batch.id} changed status to "${status}"`);
  const treatment = batch.games[0].get("treatment")
  const { managementToken, templateId } = treatment;

  const axiosInstance = axios.create({
    baseURL: 'https://api.100ms.live/v2/',
    headers: {
      'Authorization': 'Bearer ' + managementToken,
      'Content-Type': 'application/json',
    },
  });

  if (status === "running") {
    batch.games.forEach((game, i) => {
          
      const createRoomCode = async () => {
        try {
          const getRoom = await axiosInstance.post('rooms', {
            name: game.id,
            description: 'audio call room',
            template_id: templateId,
            region: 'us',
            recording_info: {
              enabled: true
            },  
          });
      
          const roomId = getRoom.data.id;
          const getCode = await axiosInstance.post(`room-codes/room/${roomId}`);
          const roomCode = String(getCode.data.data[0].code)

          game.set("roomCode", roomCode)

        } catch (error) {
          console.error('Error creating room and getting guest code:', error);
          throw error;
        }
      }
    
      createRoomCode();

      console.log('All rooms created, and all roomCodes set!')
    });
  }
});

Empirica.onGameStart(({ game }) => {
  game.players.forEach((player, i) => {
    player.set("roomCode", game.get("roomCode"));
  });

  console.log(`Game ${game.id} initialized, all players are assigned roomCodes...`)

  for (let i = 0; i < 2; i++) {
    const round = game.addRound({
      name: `Round ${i}`,
    });
    round.addStage({ name: "choice", duration: 10000 });
    round.addStage({ name: "result", duration: 10000 });
  }
});

Empirica.onRoundStart(({ round }) => {});

Empirica.onStageStart(({ stage }) => {});

Empirica.onStageEnded(({ stage }) => {});

Empirica.onRoundEnded(({ round }) => {});

Empirica.onGameEnded(({ game }) => {});