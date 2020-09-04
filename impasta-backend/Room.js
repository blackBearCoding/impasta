import {
  LOBBY_STATE,
  STARTING_STATE,
  DRAWING_STATE,
  VOTING_STATE,
  END_ROUND_STATE,
  END_GAME_STATE
} from './constants.js';
import { randArrayElement, randObjectElement, mapIdToName } from './utils.js';

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
    this.rounds = 0;
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
      votesAgainst: [],
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

  addVote = ({ votedFor, voter }) => {
    this.playerSockets[voter].votedFor = votedFor;
  };

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
    if (this.currentTurn) {
      this.currentTurn = 0;
      for (const playerId in this.playerSockets) {
        const player = this.playerSockets[playerId];
        player.votedFor = null;
        player.votesAgainst = [];
      }
    }
    this.prompt = randArrayElement(this.prompts);
    this.impasta = randObjectElement(this.playerSockets);
    this.sendAll('starting state', this.prompt, this.impasta);
  };

  startTurn = () => {
    this.gameState = DRAWING_STATE;
    const playerArr = Object.values(this.playerSockets);
    if (this.currentTurn >= playerArr.length) {
      this.startVoting();
    } else {
      const { playerId, playerName } = playerArr[this.currentTurn++];

      this.sendAll('drawing state', { playerId, playerName });
    }
  };

  startVoting = () => {
    this.gameState = VOTING_STATE;
    this.sendAll('voting state');
    setTimeout(this.tallyVotes, 10000);
  };

  tallyVotes = () => {
    const impastaPlayer = this.playerSockets[this.impasta];
    const votes = [
      {
        player: {
          playerId: impastaPlayer.playerId,
          playerName: impastaPlayer.playerName,
          score: impastaPlayer.score
        },
        votesAgainst: impastaPlayer.votesAgainst
      }
    ];

    for (const playerId in this.playerSockets) {
      const { playerName, votedFor, votesAgainst } = this.playerSockets[
        playerId
      ];

      if (votedFor) {
        if (votedFor === this.impasta) {
          const score = (this.playerSockets[playerId].score += 100);
          this.playerSockets[votedFor].votesAgainst.push({
            playerId,
            playerName,
            score
          });
        } else {
          const score = (impastaPlayer.score += 100);
          votes[0].player.score = score;
          this.playerSockets[votedFor].votesAgainst.push({
            playerId,
            playerName,
            score
          });
        }
      }

      if (playerId !== this.impasta) {
        const score = this.playerSockets[playerId].score;
        votes.push({
          player: {
            playerId,
            playerName,
            score
          },
          votesAgainst
        });
      }
    }

    if (this.rounds < 3) {
      this.rounds++;
      this.gameState = END_ROUND_STATE;
      console.log(votes);
      this.screenSocket.emit(
        'votes tallied',
        votes
      );
    } else {
      this.gameState = END_GAME_STATE;
      this.screenSocket.emit('end game');
    }
  };
}
