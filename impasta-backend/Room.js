import { LOBBY_STATE } from "./constants.js";

export default class Room {
  constructor() {
    this.code = this.generateCode();
    this.gameState = LOBBY_STATE;
    this.screenSocket = null;
    this.playerSockets = {};
  }

  generateCode = () => {
    let code = "";

    for (let i = 0; i < 4; i++) {
      code += String.fromCharCode(Math.floor(Math.random() * 24) + 65);
    }

    return code;
  };

  addPlayer = (socket) => {
    const { playerName, playerId } = socket.handshake.query;
    this.playerSockets[playerId] = { socket, playerName };

    const playerList = [];

    for (const storedPlayerId in this.playerSockets) {
      const { playerName } = this.playerSockets[storedPlayerId];
      playerList.push({ playerName, playerId: storedPlayerId });
      console.log("playerList", playerList)
    }

    console.log("Sending player list: ", playerList)
    this.screenSocket.emit("player list", playerList);
  };
}
