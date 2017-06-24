import * as React from 'react';
import { Message } from "messaging/Message";
import { User } from "messaging/User";
import { ChatData } from "messaging/ChatData";

export function MessageList(props: { chatData: ChatData }) {
  console.log(props.chatData);
  return (
    <ul className="message-list">
      {
        props.chatData.messages.map(message => {
          const sender = props.chatData.users.find(x => x.name == message.senderName);
          return <li key={message.id} className={message.senderName == props.chatData.currentUser.name ? 'from' : 'to'}>
            {message.text}
            <div className="avatar">
              <img src={sender ? sender.avatarUrl : ""} />
            </div>
          </li>
        })
      }

    </ul>
  );
}