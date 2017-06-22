import * as React from 'react';
import { ChatState } from "store/app/chat/ChatState";

interface Props {
  leave(): void
  chatState: ChatState
}

export function Chat(props: Props) {
  return (
    <div>
      <div className="row">
        <div className="col-sm-9"></div>
        <div className="col-sm-3">
          <button onClick={props.leave} className="btn btn-default btn-sm">Leave</button>
        </div>
      </div>
    </div>
  );
}