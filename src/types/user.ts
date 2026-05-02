import type { RoleName } from "./auth";

export interface User {
  id: number;
  email: string;
  name: string;
  avatar?: string | null;
  roles: Array<RoleName>;
}
