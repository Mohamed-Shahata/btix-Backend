import { JwtPayloadDecoded } from "../user/user.interface";


import { Request } from 'express';

declare global {
  namespace Express {
    interface User {
      id: string;
      role: string;
      token?: string;
      isNewUser?: boolean; // لو التوكن بيترجع مع req.user
    }

    interface Request {
      user?: Express.User;
    }
  }
}
export { };