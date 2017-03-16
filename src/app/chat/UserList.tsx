import * as React from 'react';
import { User } from "messaging/User";

export function UserList(props: { users: User[] }) {
  return (
    <ul className="user-list">
      {
        props.users.map(user => {
          return <li key={user.name}><img className="avatar" src={user.avatarUrl} /> {user.name}</li>
        })
      }
    </ul>
  );
}