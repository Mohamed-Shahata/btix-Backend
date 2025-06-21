import { Schema, model } from "mongoose";
import { ISubmissionDocument } from "../types/user/user.interface";
import { JoinStatus } from "../types/user/user.enum";


const submissionSchema = new Schema<ISubmissionDocument>({
  challengeId: {
    type: Schema.Types.ObjectId, ref: "Challenge", required: true
  },
  teamId: {
    type: Schema.Types.ObjectId, ref: "Team", required: true
  },
  status: {
    type: String, enum: JoinStatus, default: JoinStatus.PENDING // notes
  },
  notes: {
    type: String, default: null
  },
  notesFromLeader: {
    type: String, default: null
  },
  submissionLink: {
    type: String, required: true
  }
}, {
  timestamps: true
});

const Submission = model<ISubmissionDocument>("Submission", submissionSchema);
export default Submission;