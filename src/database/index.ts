import { connect } from "mongoose";
import config from "../config";

export const connectDatabase = async () => {
  await connect(config.MONGO_URI, { dbName: "playfinder" });
  console.log("Database connected.");
};
