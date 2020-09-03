import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import HomePage from './pages/HomePage';
import ScreenPage from './pages/ScreenPage';
import RoomPage from './pages/RoomPage';

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
        <Route
          exact
          path="/:code"
          render={({ match }) => <RoomPage userName={userName} match={match} />}
        />
      </Switch>
    </Router>
  );
}
