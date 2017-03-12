import { User } from "./User";

export interface MessageSubmission {
  id: any,
  isInProcess: boolean,
  text: string
}

export interface Message {
  id: any,
  sender: User,
  text: string
}