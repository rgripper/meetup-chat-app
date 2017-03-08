import { ChatState, initialChatState } from './client/ChatService';
import { applyMiddleware, combineReducers, createStore, Store } from 'redux';
import { loggerMiddleware } from './loggerMiddleware';
import { chatSessionReducer } from './chatSessionReducer';
import { routerReducer } from 'react-router-redux';

export interface AppState {
  readonly chatState: ChatState,
}

export const initialAppState: AppState = { chatState: initialChatState };

export function configureStore(initialState: AppState = initialAppState): Store<AppState> {
  const create = window.devToolsExtension
    ? window.devToolsExtension()(createStore)
    : createStore;

  const reducers = combineReducers({
    chatSession: chatSessionReducer,
    routing: routerReducer
  });

  const createStoreWithMiddleware = applyMiddleware(loggerMiddleware)(create);

  const store = createStoreWithMiddleware(reducers, initialState) as Store<AppState>;

  // if (module.hot) {
  //   module.hot.accept('../reducers', () => {
  //     const nextReducer = require('../reducers');
  //     store.replaceReducer(nextReducer);
  //   });
  // }

  return store;
}
