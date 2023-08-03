import { Permission } from "./permission.model";

export interface Role {
  id: number;
  name: string;
  permissions?: Permission[];
  created_at?: string;
  updated_at?: string;
}
