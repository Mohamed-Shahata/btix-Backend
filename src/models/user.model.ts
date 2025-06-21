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
  vrificationCode: {
    type: String, default: null
  },
  isVerified: {
    type: Boolean, default: false
  },
  password: {
    type: String, required: true, minlength: 8
  },
  teamId: {
    type: Schema.Types.ObjectId,
    ref: "Team",
    default: null
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