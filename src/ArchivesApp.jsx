// @flow
import * as React from 'react';

import Archives from './screens/Archives';
import Show from './screens/Show';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import ScrollToTop from 'components/ScrollToTop';

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Archives} />
      <Route exact path="/shows/:showId" component={Show} />
      <Redirect to="/" />
    </Switch>
  </Router>
);

export default App;