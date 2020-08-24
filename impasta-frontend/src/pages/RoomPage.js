import React, { PureComponent } from "react";
import io from "socket.io-client";

export default class RoomPage extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { code: this.props.match.params.code.toUpperCase() };
  }

  componentDidMount() {
    const socket = io("/room", {
      query: {
        code: this.state.code,
        playerId: Math.round((Math.random() * 1000000)),
        playerName: Math.round((Math.random() * 100)),
      },
    });

    socket.on("connect", () => {
      console.log("connect");
    });
  }

  render() {
    return <h1>{this.state.code}</h1>;
  }
}
