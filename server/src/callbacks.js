import { ClassicListenersCollector } from "@empirica/core/admin/classic";
import axios from 'axios';
export const Empirica = new ClassicListenersCollector();

Empirica.onGameStart(({ game }) => {
  const treatment = game.get("treatment");
  const { managementToken, templateId } = treatment;

  const axiosInstance = axios.create({
    baseURL: 'https://api.100ms.live/v2/',
    headers: {
      'Authorization': 'Bearer ' + managementToken,
      'Content-Type': 'application/json',
    },
  });

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
      const roomCode = getCode.data.data[1].code
      
      await Promise.all(game.players.map((player, i) => {
        return player.set("roomCode", roomCode);
      }));  
        
    } catch (error) {
      console.error('Error creating room and getting guest code:', error);
      throw error;
    }
  }

  createRoomCode();

  const round = game.addRound({
    name: `Round`,
  });
  round.addStage({ name: "choice", duration: 10000 });
  round.addStage({ name: "result", duration: 10000 });
});

Empirica.onRoundStart(({ round }) => {});

Empirica.onStageStart(({ stage }) => {});

Empirica.onStageEnded(({ stage }) => {});

Empirica.onRoundEnded(({ round }) => {});

Empirica.onGameEnded(({ game }) => {});