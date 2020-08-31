import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

class HomePage extends PureComponent {
  constructor() {
    super();

    this.state = {
      code: '',
      name: ''
    };
  }

  joinRoom = e => {
    this.props.setUserName(this.state.name);
    this.props.history.push(`/${this.state.code}`);
  };

  makeNewRoom = async () => {
    const res = await axios.get('/new-room');
    this.props.history.push(`/screen/${res.data}`);
  };

  handleRoomInputChange = e => {
    this.setState({ code: e.target.value.trim() });
  };

  handleNameInputChange = e => {
    this.setState({ name: e.target.value });
  };

  render() {
    return (
      <div className="Home">
        <h1>Impasta!</h1>
        <div>
          <label>
            <button onClick={this.makeNewRoom}>Make Room</button>
          </label>
        </div>
        <span>Or</span>
        <div>
          <label>
            <input
              onChange={this.handleRoomInputChange}
              value={this.state.code}
              type="text"
              placeholder="Enter Room Code"
            ></input>
            <input
              onChange={this.handleNameInputChange}
              value={this.state.name}
              type="text"
              placeholder="Enter Your Name"
            ></input>
            <button onClick={this.joinRoom}>Join Room</button>
          </label>
        </div>
      </div>
    );
  }
}

export default withRouter(HomePage);
