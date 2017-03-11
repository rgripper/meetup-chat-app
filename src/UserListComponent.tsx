import { ChatStateType } from './client/ChatState';
import * as React from 'react';
import { AppState } from './configureStore';

import { connect } from "react-redux";
import { User } from "./client/User";

function UserListComponent(props: { otherUsers: User[] }) {
  return (
    <ul>
      {
        props.otherUsers.map(user => {
          return <li key={user.name}>{user.name}</li>
        })
      }
    </ul>
  );
}

const mapStateToProps = (state: AppState) => {

  return { otherUsers: state.chatState.type != ChatStateType.AuthenticatedAndInitialized ? [] : state.chatState.data.otherUsers };
}

export const UserListContainerComponent = connect(
  mapStateToProps
)(UserListComponent);