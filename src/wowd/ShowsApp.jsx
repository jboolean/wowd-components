// @flow
import * as React from 'react';

import Shows from './screens/Shows';
import Show from './screens/Shows/screens/Show';
import Episode from './screens/Shows/screens/Episode';
import ScrollToTop from 'components/ScrollToTop';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';

const App = () => (
  <Router>
    <React.Fragment>
      <Switch>
        <Route exact path="/" component={Shows} />
        <Route exact path="/:showId" component={Show} />
        <Route exact path="/:showId/episodes/:episodeId" component={Episode} />
        <Redirect to="/" />
      </Switch>
      <ScrollToTop />
    </React.Fragment>
  </Router>
);

export default App;