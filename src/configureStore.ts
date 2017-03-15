import { applyMiddleware, combineReducers, createStore, Store } from 'redux';
import { loggerMiddleware } from './loggerMiddleware';
import { chatStateReducer } from './chatStateReducer';
import { routerReducer } from 'react-router-redux';
import { initialAppState, AppState } from "app/AppState";

export function configureStore(initialState: AppState = initialAppState): Store<AppState> {
  const create = window.devToolsExtension
    ? window.devToolsExtension()(createStore)
    : createStore;

  const reducers = combineReducers({
    chatState: chatStateReducer,
    routing: routerReducer
  });

  const createStoreWithMiddleware = applyMiddleware(loggerMiddleware)(create);

  const store = createStoreWithMiddleware(reducers, initialState) as Store<AppState>;

  if (module.hot) {
    module.hot.accept('./chatStateReducer', () => {
      const nextReducer = require('./chatStateReducer');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
