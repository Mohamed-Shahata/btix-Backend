import { Schema, model } from "mongoose";
import { IMarathonDocument } from "../types/user/user.interface";


const marathonSchema = new Schema<IMarathonDocument>({
  title: {
    type: String, required: true, minlength: 2
  },
  description: {
    type: String, required: true, minlength: 20
  },
  startDate: {
    type: Date, required: true
  },
  endDate: {
    type: Date, required: true
  },
  isActive: {
    type: Boolean, default: false
  }
}, {
  timestamps: true
});

const Marathon = model<IMarathonDocument>("Marathon", marathonSchema);
export default Marathon;