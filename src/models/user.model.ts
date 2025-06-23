import { Schema, model } from "mongoose";
import { IUserDocument } from "../types/user/user.interface";
import { Gender, RolesTeam, RolesType } from "../types/user/user.enum";


const userSchema: Schema<IUserDocument> = new Schema<IUserDocument>({
  username: {
    type: String, required: true, minlength: 2
  },
  email: {
    type: String, required: true, unique: true
  },
  gender: {
    type: String, enum: Gender, default: Gender.MALE
  },
  verificationCode: {
    type: String, default: null
  },
  points: {
    type: Number, default: 0
  },
  bio: {
    type: String, default: ""
  },
  job: {
    type: String, default: ""
  },
  address: {
    type: String, default: ""
  },
  githubAccount: {
    type: String, default: ""
  },
  isVerified: {
    type: Boolean, default: false
  },
  password: {
    type: String, minlength: 8
  },
  teamId: {
    type: Schema.Types.ObjectId,
    ref: "Team",
    default: null
  },
  resetPasswordToken: {
    type: String, default: ""
  },
  roleInTeam: {
    type: String, enum: RolesTeam, default: null
  },
  role: {
    type: String, enum: RolesType, default: RolesType.MEMBER
  }
}, {
  timestamps: true
});

const User = model<IUserDocument>("User", userSchema);
export default User;