import * as React from 'react';
import { User } from "./client/User";

export function UserList(props: { otherUsers: User[] }) {
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