import { Message } from "../components/chats/models/message.model";
import { Permission } from "./permission.model";
import { Role } from "./role.model";
import { UserDetail } from "./userDetail.model";

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
  dob: number;
  password?: string;
  confirm_password?: string;
  status?: boolean;
  UserDetail?: UserDetail;
  all_permissions? : Permission[];
  roles?: Role[];
  active_status?:boolean;
  avatar?:string;
  dark_mode?: boolean;
  messenger_color: string;
  last_message: Message;
  max_created_at?:string;
  unseen?: number;
}
