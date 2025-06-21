import { RolesType } from "./user.enum";

export type JWTType = {
  id: string | unknown,
  role: RolesType
}

