import { ClassicListenersCollector } from "@empirica/core/admin/classic";
import axios from 'axios';
import _ from 'underscore';
const fs = require("fs");

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

  const csvFilePath='./src/samplestims.csv' 
  const csv=require('csvtojson') 
  const stims = csv()
  .fromFile(csvFilePath)
  .then((jsonObj)=>{
      console.log(jsonObj);
      return(jsonObj);
  })

  const roleList = _.shuffle(['director','guesser'])
  game.players.forEach((player, i) => {
		player.set("role", roleList[i]);
		console.log(player);
  });

  game.players.forEach((player, i) => {
    player.set("roomCode", game.get("roomCode"));
  });

  console.log(`Game ${game.id} initialized, all players are assigned roomCodes...`)

  let roundCounter = 1;

  stims.map(function(stim) {
    const round = game.addRound({
      name: `Round ${roundCounter}`,
      target: stim.target,
      images: stim.images.split(","),
      guesserOrder: _.shuffle(stim.images.split(",")),
      directorOrder: _.shuffle(stim.images.split(","))
    });
    round.addStage({ name: "choice", duration: 10000 });
    round.addStage({ name: "result", duration: 10000 });
    roundCounter++; 
  })

});

Empirica.onRoundStart(({ round }) => {});

Empirica.onStageStart(({ stage }) => {});

Empirica.onStageEnded(({ stage }) => {});

Empirica.onRoundEnded(({ round }) => {});

Empirica.onGameEnded(({ game }) => {});