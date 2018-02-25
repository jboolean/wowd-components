// @flow
import * as React from 'react';

import Archives from './screens/Archives';
import Show from './screens/Show';
import Episode from './screens/Episode';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Archives} />
      <Route exact path="/shows/:showId" component={Show} />
      <Route exact path="/shows/:showId/episodes/:episodeId" component={Episode} />
      <Redirect to="/" />
    </Switch>
  </Router>
);

export default App;