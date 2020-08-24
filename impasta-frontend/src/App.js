import React, { PureComponent } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import HomePage from "./pages/HomePage";
import ScreenPage from "./pages/ScreenPage";
import RoomPage from "./pages/RoomPage";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/screen/:code" component={ScreenPage} />
        <Route exact path="/room/:code" component={RoomPage} />
      </Switch>
    </Router>
  );
}
