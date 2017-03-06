import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';

import { AppComponent } from './AppComponent';
import { configureStore } from './configureStore';

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

// Add mobile QR code view
ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={AppComponent}>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
