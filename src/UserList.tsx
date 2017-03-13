import * as React from 'react';
import { User } from "./client/User";

export function UserList(props: { users: User[] }) {
  return (
    <ul>
      {
        props.users.map(user => {
          return <li key={user.name}>{user.name}</li>
        })
      }
    </ul>
  );
}