import { User } from './User';
import { Message } from "./Message";

export interface Session {
  readonly id: any,
  readonly user: User,
  readonly otherUsers: User[],
  readonly messages: Message[],
}
