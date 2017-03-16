import * as React from 'react';
import { Message } from "messaging/Message";
import { User } from "messaging/User";

export function MessageList(props: { currentUser: User, messages: Message[] }) {
  return (
    <ul className="message-list">
      {
        props.messages.map(message => {
          return (
           <li key={message.id} className={message.sender.name == props.currentUser.name ? 'from-current' : 'to-current'}>
            {message.text}
            <div className="avatar">
              <img src={message.sender.avatarUrl} />
            </div>
          </li>
          )
        })
      }
    </ul>
  );
}