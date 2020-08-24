import React, { PureComponent } from "react";
import io from "socket.io-client";

export default class ScreenPage extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      code: this.props.match.params.code.toUpperCase(),
      playerList: [],
    };
  }

  componentDidMount() {
    const socket = io("/screen", {
      query: { code: this.state.code },
    });

    socket.on("connect", () => {
      console.log("connect");
    });

    socket.on("player list", (playerList) => {
      console.log(playerList);
      this.setState({ playerList });
    });
  }

  render() {
    return (
      <div>
        <h1>{this.state.code}</h1>
        <ul>
          {this.state.playerList.map((player) => (
            <li key={player.playerId}>{player.playerName}</li>
          ))}
        </ul>
      </div>
    );
  }
}
