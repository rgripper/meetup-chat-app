import { User } from "./User";

export interface MessageSubmission {
  text: string
}

export interface Message {
  id: any,
  sender: User,
  text: string
}