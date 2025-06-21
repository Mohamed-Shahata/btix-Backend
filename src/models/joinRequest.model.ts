import { Schema, model } from "mongoose";
import { IJoinRequestDocument } from "../types/user/user.interface";
import { JoinStatus } from "../types/user/user.enum";


const joinRequestSchema = new Schema<IJoinRequestDocument>({
  teamId: {
    type: Schema.Types.ObjectId, ref: "Team", required: true
  },
  userId: {
    type: Schema.Types.ObjectId, ref: "User", required: true
  },
  status: {
    type: String, enum: JoinStatus, default: JoinStatus.PENDING
  }
}, {
  timestamps: true
});

const JoinRequest = model<IJoinRequestDocument>("JoinRequest", joinRequestSchema);
export default JoinRequest;