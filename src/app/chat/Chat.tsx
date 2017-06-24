import * as React from 'react';

import { SubmittedMessage } from "messaging/SubmittedMessage";
import { ChatData } from "messaging/ChatData";
import { UserList } from "app/chat/UserList";
import { MessageList } from "app/chat/MessageList";
import { MessageInput } from "app/chat/MessageInput";

interface Props {
  leave(): void
  sendMessage(submittedMessage: SubmittedMessage): void
  chatData: ChatData
}

export function Chat(props: Props) {
  return (
    <div>
      <div className="row">
        <div className="col-sm-9"><UserList users={props.chatData.users}></UserList></div>
        <div className="col-sm-3"><button className="btn btn-default btn-sm" onClick={props.leave}>Leave</button></div>
      </div>
      
      <MessageList chatData={props.chatData}></MessageList>
      <MessageInput sendMessage={props.sendMessage}></MessageInput>
    </div>
  );
}