import { User } from "./User";

export interface Message {
  sender: User,
  text: string,
  image: string,
}