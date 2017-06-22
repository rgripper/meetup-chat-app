import { applyMiddleware, combineReducers, createStore, Store } from 'redux';
import { chatStateReducer } from './app/chat/chatStateReducer';
import { initialAppState, AppState } from "./app/AppState";
import logger from 'redux-logger';

export function configureStore(initialState: AppState = initialAppState): Store<AppState> {
 
  const create = window.devToolsExtension
    ? window.devToolsExtension()(createStore)
    : createStore;

  const reducers = combineReducers({
    chatState: chatStateReducer
  });

  const createStoreWithMiddleware = applyMiddleware(logger)(create);

  const store = createStoreWithMiddleware(reducers, initialState) as Store<AppState>;

  // if (module.hot) {
  //   module.hot.accept('./store/app/chat/chatStateReducer', () => {
  //     const nextReducer = require('./app/chat/chatStateReducer');
  //     store.replaceReducer(nextReducer);
  //   });
  // }

  return store;
}
