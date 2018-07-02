// @flow
import * as React from 'react';

import Dj from './screens/Dj';
import ScrollToTop from 'components/ScrollToTop';
import {
  HashRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import AppContext from 'components/AppContext';

const App = () => (
  <AppContext.Provider value="/djs">
    <Router>
      <React.Fragment>
        <Switch>
          <Route exact path="/:djId" component={Dj} />
        </Switch>
        <ScrollToTop />
      </React.Fragment>
    </Router>
  </AppContext.Provider>
);

export default App;