import { connect } from "mongoose";
import { MONGO_URL } from "./index.js";

const connectDB = async () => {
  try {
    await connect(MONGO_URL);
    console.log("DB connected");
  } catch (e) {
    console.log("Error while connecting to the DB: ", e);
    process.exit(1);
  }
};

export { connectDB };
