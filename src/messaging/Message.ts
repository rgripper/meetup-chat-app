import { User } from "./User";

export interface Message {
  id: any,
  creationDate: Date,
  sender: User,
  text: string
}