import type { RoleName } from "./auth";

export interface User {
  id: number;
  email: string;
  name: string;
  roles: Array<RoleName>;
}
