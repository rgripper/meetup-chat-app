import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';

import { AppContainer } from './app/AppContainer';
import { configureStore } from './store/configureStore';

import { ChatStateType } from './store/ChatState';
import { JoinResult } from './messaging/ChatService';
import { User } from "./messaging/User";
import { Message } from "./messaging/Message";
import { ChatActionType } from "./store/chatStateReducer";
import { ChatService } from "./messaging/ChatService";
import { appSettings } from './app/appSettings';

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

import './index.scss';

const chatService = new ChatService(appSettings.chatServerUrl, {
  handleJoinResult: (joinResult: JoinResult) => {
    store.dispatch({    
      type: ChatActionType.JoinResultReceived,
      payload: { 
        chatState: joinResult.isSuccessful 
        ? { type: ChatStateType.AuthenticatedAndInitialized, data: joinResult.initialData }
        : { type: ChatStateType.AuthenticationFailed, errorMessage: joinResult.errorMessage }
      }
    })
  },
  handleMessageReceived: (message: Message) => store.dispatch({    
    type: ChatActionType.MessageReceived,
    payload: { message }
  }),
  handleUserJoined: (user: User) => store.dispatch({    
    type: ChatActionType.UserJoined,
    payload: { user }
  }),
  handleUserReft: (userName: string) => store.dispatch({    
    type: ChatActionType.UserLeft,
    payload: { userName }
  }),
});

const sendMessage = (x) => chatService.sendMessage(x);
const join = (x) => {
  store.dispatch({ type: ChatActionType.JoinInProgress });
  chatService.join(x);
}
const leave = () => {
  store.dispatch({ type: ChatActionType.Left });
  chatService.leave();
}
(store as any).chatService = chatService;


ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={() => <AppContainer sendMessage={sendMessage} join={join} leave={leave}></AppContainer>}>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);