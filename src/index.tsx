import { ChatState } from './client/ChatState';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';

import { AppContainerComponent } from './AppComponent';
import { configureStore } from './configureStore';
import { ChatService } from "./client/ChatService";
import { User } from "./client/User";
import { Message } from "./client/Message";
import { ChatActionType } from "./chatSessionReducer";

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

const chatService = new ChatService('http://localhost:26335', {
  handleState: (chatState: ChatState) => store.dispatch({    
    type: ChatActionType.Initialized,
    payload: { chatState }
  }),
  handleMessageReceived: (message: Message) => store.dispatch({    
    type: ChatActionType.MessageReceived,
    payload: { message }
  }),
  handleUserJoined: (user: User) => store.dispatch({    
    type: ChatActionType.UserJoined,
    payload: { user }
  }),
  handleUserReft: (user: User) => store.dispatch({    
    type: ChatActionType.UserLeft,
    payload: { user }
  }),
});

(store as any).chatService = chatService; // TODO: figure out how to save instance

// Add mobile QR code view
ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={AppContainerComponent}>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);