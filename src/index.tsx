import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import { Provider } from 'react-redux';
import { createBrowserHistory } from "history";

import { AppContainer } from './app/AppContainer';
import { appSettings } from './app/appSettings';

import { configureStore } from './store/configureStore';
import { configureChatService } from "./app/configureChatService";
import { createActions } from "./store/app/createActions";

import './index.scss';

const store = configureStore();
const history = createBrowserHistory();
const chatService = configureChatService(appSettings.chatServerUrl, store.dispatch.bind(store))
const actions = createActions(chatService, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={() => 
        <AppContainer sendMessage={actions.sendMessage} join={actions.join} leave={actions.leave}>
        </AppContainer>
      }>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);