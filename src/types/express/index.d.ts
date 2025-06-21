import { JwtPayloadDecoded } from "../user/user.interface";


declare global {
  namespace Express {
    interface Request {
      user?: JwtPayloadDecoded;
    }
  }
}
export { };