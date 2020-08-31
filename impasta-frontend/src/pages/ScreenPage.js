import React, { PureComponent } from 'react';
import io from 'socket.io-client';

import {
  LOBBY_STATE,
  STARTING_STATE,
  DRAWING_STATE,
  VOTING_STATE,
  END_ROUND_STATE
} from '../constants.js';
import { mapIdToName } from '../utils';

export default class ScreenPage extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      code: this.props.match.params.code.toUpperCase(),
      playerList: [],
      socket: null,
      gameState: LOBBY_STATE,
      voteDisplay: []
    };
  }

  componentDidMount() {
    const socket = io('/screen', {
      query: { code: this.state.code }
    });

    socket.on('connect', () => {
      console.log('connect');
    });

    socket.on('player list', playerList => {
      this.setState({ playerList });
    });

    socket.on('starting state', () => {
      this.setState(
        {
          gameState: STARTING_STATE
        },
        this.displayTutorial
      );
    });

    socket.on('drawing state', () => {
      this.setState({
        gameState: DRAWING_STATE
      });
    });

    socket.on('voting state', () => {
      this.setState({
        gameState: VOTING_STATE
      });
    });

    socket.on('votes tallied', ({ impastaVotes, wrongVotes }) => {
      this.setState(
        {
          gameState: END_ROUND_STATE
        },
        () => this.displayRoundResults(impastaVotes, Object.entries(wrongVotes))
      );
    });

    this.setState({ socket });
  }

  componentWillUnmount() {
    this.state.socket.disconnect();
  }

  displayRoundResults = (impastaVotes, wrongVotes) => {
    if (!wrongVotes.length) {
      this.setState({
        voteDisplay: impastaVotes
      });
    } else {
      const wrongVote = wrongVotes.pop();
      this.setState({
        voteDisplay: wrongVote
      });
      setTimeout(
        () => this.displayRoundResults(impastaVotes, wrongVotes),
        2000
      );
    }
  };

  displayTutorial = () => {
    setTimeout(() => {
      this.state.socket.emit('start turn');
    }, 2000);
  };

  render() {
    let display;
    switch (this.state.gameState) {
      case LOBBY_STATE:
        display = (
          <ul>
            {this.state.playerList.map(player => (
              <li key={player.playerId}>{player.playerName}</li>
            ))}
          </ul>
        );
        break;

      case STARTING_STATE:
        display = <p>Tutorial Here</p>;
        break;

      case DRAWING_STATE:
        display = <p>Draw here</p>;
        break;

      case VOTING_STATE:
        display = <p>Vote now!</p>;
        break;

      case END_ROUND_STATE:
        display = (
          <>
            <ul>
              {mapIdToName(
                this.state.playerList,
                this.state.voteDisplay.value
              ).map(name => {
                return <li>{name}</li>;
              })}
            </ul>
            <h2>
              {mapIdToName(this.state.playerList, this.state.voteDisplay.key)}
            </h2>
          </>
        );
    }
    return (
      <div>
        <h1>{this.state.code} (Screen)</h1>
        <h2>{this.state.gameState}</h2>
        {display}
      </div>
    );
  }
}
