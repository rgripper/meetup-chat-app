import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';

import { AppComponent } from './AppComponent';
import { configureStore } from './configureStore';
import { ChatService } from "./client/ChatService";

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

const chatService = new ChatService('http://localhost:26335', {
  handleState: store.dispatch({ type:  }),
  handleMessageReceived: store.dispatch({ type: }),
  handleUserJoined: store.dispatch({ type: }),
  handleUserReft: store.dispatch({ type: }),
});

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
