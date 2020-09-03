import React, { PureComponent } from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

import {
  LOBBY_STATE,
  STARTING_STATE,
  DRAWING_STATE,
  WAITING_STATE,
  VOTING_STATE
} from '../constants.js';

export default class RoomPage extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      code: this.props.match.params.code.toUpperCase(),
      playerList: [],
      socket: null,
      isFirst: false,
      gameState: LOBBY_STATE,
      isImpasta: false,
      prompt: null,
      playerId: null,
      currentPlayer: null,
    };
  }

  componentDidMount() {
    const playerId = uuidv4();
    const socket = io('/room', {
      query: {
        code: this.state.code,
        playerId,
        playerName: this.props.userName
      }
    });

    socket.on('connect', () => {
      console.log('connect');
    });

    socket.on('player list', playerList => {
      const isFirst = playerList.length === 1 ? true : this.state.isFirst;
      this.setState({
        playerList,
        isFirst
      });
    });

    socket.on('starting state', msg => {
      console.log(msg);
      this.setState({
        gameState: STARTING_STATE,
        isImpasta: !msg,
        prompt: msg
      });
    });

    socket.on('drawing state', msg => {
      this.setState({
        gameState:
          msg.playerId === this.state.playerId ? DRAWING_STATE : WAITING_STATE,
        currentPlayer: msg
      });
    });

    socket.on('voting state', () => {
      this.setState({
        gameState: VOTING_STATE,
      })
    })

    this.setState({ socket, playerId });
  }

  componentWillUnmount() {
    this.state.socket.disconnect();
  }

  handleDrawingSubmit = () => {
    const socket = this.state.socket;
    socket.emit('start turn');
  };

  handleStartGame = () => {
    const socket = this.state.socket;
    socket.emit('start game');
  };

  handleVote = playerId => {
    const socket = this.state.socket;
    socket.emit('player voted', {votedFor: playerId, voter: this.state.playerId});
  }

  render() {
    let display;

    switch (this.state.gameState) {
      case LOBBY_STATE:
        display = (
          <>
            <ul>
              {this.state.playerList.map(player => (
                <li key={player.playerId}>{player.playerName}</li>
              ))}
            </ul>
            {this.state.isFirst && this.state.gameState === LOBBY_STATE ? (
              <button onClick={this.handleStartGame}>Start Game</button>
            ) : null}
          </>
        );
        break;

      case STARTING_STATE:
        display = (
          <h3>
            {this.state.isImpasta ? 'You are the impasta!' : this.state.prompt}
          </h3>
        );
        break;

      case WAITING_STATE:
        display = (
          <span>
            It's {this.state.currentPlayer.playerName}'s turn to play with their
            food.
          </span>
        );
        break;

      case DRAWING_STATE:
        display = (
          <>
            <span>It's your turn!</span>
            <button onClick={this.handleDrawingSubmit}>Submit</button>
          </>
        );
        break;

      case VOTING_STATE:
        display = (
          <>
            {this.state.playerList
              .filter(player => {
                return player.playerId !== this.state.playerId;
              })
              .map(player => {
                return (
                  <button onClick={() => this.handleVote(player.playerId)}>
                    {player.playerName}
                  </button>
                );
              })}
          </>
        );
        break;

      default:
        break;
    }
    return (
      <div>
        <h1>{this.state.code} (Room)</h1>
        <h2>{this.state.gameState}</h2>
        {display}
      </div>
    );
  }
}
