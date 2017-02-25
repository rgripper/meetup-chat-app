import { routerReducer as routing, RouteActions } from 'react-router-redux';
import { combineReducers } from 'redux';
import todos from './todos';

export interface RootState {
  routing: RouteActions;
  todos: TodoStoreState;
}

export default combineReducers<RootState>({
  routing,
  todos
});
