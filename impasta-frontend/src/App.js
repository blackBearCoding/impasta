import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import HomePage from './pages/HomePage/HomePage';
import ScreenPage from './pages/ScreenPage/ScreenPage';
import RoomPage from './pages/RoomPage/RoomPage';
import TestPage from './pages/TestPage/TestPage';

import './global.css';

export default function App() {
  const [userName, setUserName] = useState(null);

  return (
    <Router>
      <Switch>
        <Route
          exact
          path="/"
          render={() => <HomePage setUserName={setUserName} />}
        />
        <Route exact path="/screen/:code" component={ScreenPage} />
        <Route exact path="/room-test" component={TestPage} />
        <Route exact path="/room-test/:pageState" component={TestPage} />
        <Route
          exact
          path="/:code"
          render={({ match }) => <RoomPage userName={userName} match={match} />}
        />
      </Switch>
    </Router>
  );
}
