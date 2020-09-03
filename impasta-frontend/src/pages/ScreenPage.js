import React, { PureComponent } from 'react';
import io from 'socket.io-client';

import {
  LOBBY_STATE,
  STARTING_STATE,
  DRAWING_STATE,
  VOTING_STATE,
  END_ROUND_STATE,
  SCORE_DISPLAY_STATE
} from '../constants.js';

export default class ScreenPage extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      code: this.props.match.params.code.toUpperCase(),
      playerList: [],
      socket: null,
      gameState: LOBBY_STATE,
      voteDisplay: {
        votesAgainst: [],
        player: {},
        isImpasta: false
      },
      impasta: null,
      scores: [
        {
          playerName: null,
          score: 0
        }
      ]
    };
  }

  componentDidMount() {
    const socket = io('/screen', {
      query: { code: this.state.code }
    });

    socket.on('connect', () => {
      console.log('connect');
    });

    socket.on('player list', (playerList) => {
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

    socket.on('votes tallied', (votes) => {
      console.log('votes', JSON.stringify(votes));

      this.displayRoundResults(votes);
    });

    this.setState({ socket });
  }

  componentWillUnmount() {
    this.state.socket.disconnect();
  }

  displayRoundResults = (votes) => {
    if (votes.length === this.state.playerList.length) {
      var scores = votes.map((vote) => ({
        playerName: vote.player.playerName,
        score: vote.player.score
      }));
    }
    const { player, votesAgainst } = votes.pop();
    console.log(votes, votes.length, !votes.length);
    this.setState({
      gameState: END_ROUND_STATE,
      voteDisplay: { player, votesAgainst, isImpasta: !votes.length },
      scores: scores ? scores : this.state.scores
    });

    if (votes.length) {
      setTimeout(() => this.displayRoundResults(votes), 2000);
    } else {
      setTimeout(() => {
        this.setState({
          gameState: SCORE_DISPLAY_STATE
        });
        this.startNextRound()
      }, 2000);
    }
  };

  displayTutorial = () => {
    setTimeout(() => {
      this.state.socket.emit('start turn');
    }, 2000);
  };

  startNextRound = () => {
    const socket = this.state.socket;
    setTimeout(() => {
      socket.emit('start game');
    }, 2000);
  }

  render() {
    let display;
    switch (this.state.gameState) {
      case LOBBY_STATE:
        display = (
          <ul>
            {this.state.playerList.map((player) => (
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
        const { votesAgainst, player, isImpasta } = this.state.voteDisplay;
        display = (
          <>
            <p>
              {votesAgainst.map((player) => player.playerName).join(', ')} voted
              for {player.playerName}
            </p>
            <h2>Which was {isImpasta ? 'Correct' : 'Incorrect'}</h2>
          </>
        );
        break;

      case SCORE_DISPLAY_STATE:
        display = (
          <>
            <ul>
              {this.state.scores.map((score) => (
                <p>
                  {score.playerName} has {score.score} points!
                </p>
              ))}
            </ul>
          </>
        );
        break;

      default:
        break;
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
