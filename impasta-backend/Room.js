import { LOBBY_STATE, STARTING_STATE, DRAWING_STATE, VOTING_STATE, END_ROUND_STATE } from './constants.js';
import { randArrayElement, randObjectElement } from './utils.js';

export default class Room {
  constructor() {
    this.code = this.generateCode();
    this.gameState = LOBBY_STATE;
    this.screenSocket = null;
    this.playerSockets = {};
    this.prompts = ['house', 'apple', 'tv'];
    this.prompt = null;
    this.impasta = null;
    this.currentTurn = 0;
  }

  generateCode = () => {
    let code = '';

    for (let i = 0; i < 4; i++) {
      code += String.fromCharCode(Math.floor(Math.random() * 24) + 65);
    }

    return code;
  };

  addPlayer = socket => {
    const { playerName, playerId } = socket.handshake.query;
    this.playerSockets[playerId] = {
      socket,
      playerName,
      playerId,
      connected: true,
      votedFor: null,
      score: 0
    };

    const playerList = [];

    for (const storedPlayerId in this.playerSockets) {
      const { playerName } = this.playerSockets[storedPlayerId];
      playerList.push({ playerName, playerId: storedPlayerId });
      console.log('playerList', playerList);
    }

    console.log('Sending player list: ', playerList);
    this.sendAll('player list', playerList);
  };

  addVote = ({votedFor, voter}) => {
    this.playerSockets[voter].votedFor = votedFor;
  }

  removePlayer = playerId => {
    this.playerSockets[playerId].connected = false;
  };

  sendAll = (event, data, except) => {
    this.screenSocket.emit(event, data);

    Object.values(this.playerSockets).forEach(player =>
      player.socket.emit(event, except === player.playerId ? null : data)
    );
  };

  startGame = () => {
    this.gameState = STARTING_STATE;
    this.prompt = randArrayElement(this.prompts);
    this.impasta = randObjectElement(this.playerSockets);
    this.sendAll('starting state', this.prompt, this.impasta);
  };

  startTurn = () => {
    this.gameState = DRAWING_STATE;
    const playerArr = Object.values(this.playerSockets);
    console.log(this.currentTurn);
    if (this.currentTurn >= playerArr.length) {
      this.startVoting();
    } else {
      const {playerId, playerName} = playerArr[this.currentTurn++];
      
      this.sendAll('drawing state', {playerId, playerName});
    }
  };

  startVoting = () => {
    this.gameState = VOTING_STATE;
    this.sendAll('voting state');
    setTimeout(this.tallyVotes, 10000);
  };

  tallyVotes = () => {
    const playerArr = Object.values(this.playerSockets);
    const impastaPlayer = this.playerSockets[this.impasta];
    const votes = {
      impastaVotes: {
        key: this.impasta,
        value: []
      },
      wrongVotes: {}
    }

    playerArr.forEach(player => {
      if (player.votedFor === this.impasta) {
        player.score += 100;
        votes.impastaVotes.value.push(player.playerId);
      } else {
        impastaPlayer.score += 100;
        let wrongPlayer = votes.wrongVotes[player.votedFor];
        if (wrongPlayer) {
          wrongPlayer.push(player.playerId);
        } else {
          wrongPlayer = [player.playerId];
        }
      }
    })

    this.gameState = END_ROUND_STATE;
    console.log('end round state');
    this.screenSocket.emit('votes tallied', votes);
  }
}
