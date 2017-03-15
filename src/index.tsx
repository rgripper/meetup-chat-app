import { JoinResult } from './messaging/ChatService';
import { ChatState } from 'app/messaging/ChatState';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';

import { AppContainer } from 'app/AppContainer';
import { configureStore } from './configureStore';

import { User } from "messaging/User";
import { Message } from "messaging/Message";
import { ChatActionType } from "chatStateReducer";
import { ChatService } from "messaging/ChatService";

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

import './index.scss';

const chatService = new ChatService('http://localhost:37753', {
  handleJoinResult: (joinResult: JoinResult) => {
    if (joinResult.isSuccessful) {
      store.dispatch({    
        type: ChatActionType.Initialized,
        payload: { chatState }
      })
    }
  },
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

const sendMessage = (x) => chatService.sendMessage(x);
const join = (x) => chatService.join(x);
const leave = () => chatService.leave();
(store as any).chatService = chatService; // TODO: figure out how to save instance

// Add mobile QR code view
ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={() => <AppContainer sendMessage={sendMessage} join={join} leave={leave}></AppContainer>}>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);