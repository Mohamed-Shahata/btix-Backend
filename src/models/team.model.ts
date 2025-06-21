import { Schema, model } from "mongoose";
import { ITeamDocument } from "../types/user/user.interface";


const teamSchema = new Schema<ITeamDocument>({
  name: {
    type: String, required: true, minlength: 2,
  },
  leader: {
    type: Schema.Types.ObjectId, ref: "User", required: true
  },
  members: [
    {
      type: Schema.Types.ObjectId, ref: "User", required: true
    }
  ],
  maxMembers: {
    type: Number, default: 0
  },
  marathonId: {
    type: Schema.Types.ObjectId, ref: "Marathon", required: true
  },
  totalPoints: {
    type: Number, default: 0
  }
}, {
  timestamps: true
});

const Team = model<ITeamDocument>("Team", teamSchema);
export default Team;