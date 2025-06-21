import { Schema, model } from "mongoose";
import { IChallengeDocument } from "../types/user/user.interface";


const challengeSchema = new Schema<IChallengeDocument>({
  title: {
    type: String, required: true, minlength: 2
  },
  description: {
    type: String, required: true, minlength: 20
  },
  point: {
    type: Number, required: true
  },
  marathonId: {
    type: Schema.Types.ObjectId, ref: "Marathon", required: true
  },
  deadline: {
    type: Date
  }
}, {
  timestamps: true
});

const Challenge = model<IChallengeDocument>("Challenge", challengeSchema);
export default Challenge;