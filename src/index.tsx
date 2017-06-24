import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import { Provider } from 'react-redux';
import { createBrowserHistory } from "history";

import { AppContainer } from 'app/AppContainer';
import { appSettings } from './app/appSettings';

import { configureStore } from './store/configureStore';
import { createChatServiceBoundToStore } from "./app/createChatServiceBoundToStore";
import { createAppActions } from "./store/app/createAppActions";

import './index.scss';

const store = configureStore();
const history = createBrowserHistory();
const chatService = createChatServiceBoundToStore(appSettings.chatServerUrl, store.dispatch.bind(store))
const actions = createAppActions(chatService, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={() => 
        <AppContainer actions={actions}>
        </AppContainer>
      }>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);