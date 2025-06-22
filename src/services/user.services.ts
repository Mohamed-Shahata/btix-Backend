import User from "../models/user.model";


export const getUserServices = (id: string) => {
  return User.findById(id).populate({
    path: "teamId",
    select: "marathonId name"
  })

}