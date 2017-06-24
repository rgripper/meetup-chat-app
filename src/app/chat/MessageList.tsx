import * as React from 'react';
import { Message } from "messaging/Message";
import { User } from "messaging/User";

export function MessageList(props: { currentUser: User, messages: Message[] }) {
  return (
    <ul className="message-list">

    </ul>
  );
}