import { Schema, Types } from "mongoose";
import { IUser } from "../user/user.interface";

export interface ITeam {
  name: string,
  leader: Schema.Types.ObjectId,
  members: Array<Schema.Types.ObjectId> | Array<IUser>,
  marathonId: Types.ObjectId,
  totalPoints: number
}