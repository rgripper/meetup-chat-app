import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import { Provider } from 'react-redux';
import { createBrowserHistory } from "history";

import { AppContainer } from './app/AppContainer';
import { configureStore } from './store/configureStore';

import { ChatStateType } from './store/app/chat/ChatState';
import { JoinResult } from './messaging/ChatService';
import { User } from "./messaging/User";
import { Message } from "./messaging/Message";
import { ChatActionType } from "./store/app/chat/chatStateReducer";
import { ChatService } from "./messaging/ChatService";
import { appSettings } from './app/appSettings';
import { SubmittedMessage } from "./messaging/SubmittedMessage";
import './index.scss';

const store = configureStore();
const history = createBrowserHistory();

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

const sendMessage = (message: SubmittedMessage) => chatService.sendMessage(message);
const join = (userName: string) => {
  store.dispatch({ type: ChatActionType.JoinInProgress });
  chatService.join(userName);
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