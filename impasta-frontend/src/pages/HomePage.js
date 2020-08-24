import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";

class HomePage extends PureComponent {
  constructor() {
    super();

    this.state = {
      code: "",
    };
  }

  joinRoom = (e) => {
    this.props.history.push(`/room/${this.state.code}`);
  };

  makeNewRoom = async () => {
    const res = await axios.get("/new-room");
    this.props.history.push(`/screen/${res.data}`);
  };

  handleRoomInputChange = (e) => {
    this.setState({ code: e.target.value });
  };

  render() {
    return (
      <div className="Home">
        <h1>Impasta!</h1>
        <label>
          <input
            onChange={this.handleRoomInputChange}
            value={this.state.code}
            type="text"
          ></input>
          <button onClick={this.joinRoom}>Join Room</button>
          <button onClick={this.makeNewRoom}>Make Room</button>
        </label>
      </div>
    );
  }
}

export default withRouter(HomePage);
