import { Document, Schema, Types } from "mongoose";
import { Gender, JoinStatus, RolesTeam, RolesType } from "./user.enum";


export interface IUser {
  username: string,
  teamId?: Schema.Types.ObjectId | null,
  email: string,
  gender: Gender,
  roleInTeam: RolesTeam | null,
  verificationCode: string | null,
  isVerified: boolean,
  bio?: string,
  job?: string,
  address?: string,
  githubAccount?: string,
  points: number,
  password: string | null,
  role: RolesType
}

export interface ITeam {
  name: string,
  leader: Schema.Types.ObjectId,
  members: Array<Schema.Types.ObjectId>,
  marathonId: Types.ObjectId,
  maxMembers: number,
  totalPoints: number
}

export interface IMarathon {
  title: string,
  description: string,
  startDate: Date,
  endDate: Date,
  isActive: Boolean
}

export interface IChallenge {
  title: string,
  description: string,
  point: number,
  marathonId: Types.ObjectId
  deadline: Date
}

export interface ISubmission {
  challengeId: Types.ObjectId,
  teamId: Types.ObjectId,
  notes?: string | null,
  notesFromLeader?: string | null,
  status: JoinStatus,
  submissionLink: string
}

export interface IJoinRequest {
  teamId: Schema.Types.ObjectId,
  userId: Schema.Types.ObjectId,
  status: JoinStatus
}

export interface IUserDocument extends IUser, Document { };
export interface ITeamDocument extends ITeam, Document { };
export interface IMarathonDocument extends IMarathon, Document { };
export interface IChallengeDocument extends IChallenge, Document { };
export interface ISubmissionDocument extends ISubmission, Document { };
export interface IJoinRequestDocument extends IJoinRequest, Document { };

export interface JwtPayloadDecoded {
  id: string,
  role: RolesType
}