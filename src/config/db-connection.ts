import mongoose from "mongoose";
import { config } from "dotenv";
config();

const connextion_db = (): void => {

  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) throw new Error("MONGO_URI is not defined in enviroment variables");

  mongoose.connect(MONGO_URI)
    .then(() => console.log("connecton db success"))
    .catch((err) => console.log("connecton db error: ", err))
};

export default connextion_db;