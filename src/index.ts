import mongoose from "mongoose";
import { app } from "./app";
import dotenv from "dotenv";
dotenv.config();

const start = async () => {
  try {
    if (!process.env.JWT_KEY) {
      throw new Error("JWT_KEY must be defined in .env");
    }
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI must be defined in .env");
    }
    if (!process.env.TWITTER_API_KEY) {
      throw new Error("TWITTER_API_KEY must be defined in .env");
    }
    if (!process.env.TWITTER_API_SECRET) {
      throw new Error("TWITTER_API_SECRET must be defined in .env");
    }
    if (!process.env.ACCESS_TOKEN) {
      throw new Error("ACCESS_TOKEN must be defined in .env");
    }
    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new Error("ACCESS_TOKEN_SECRET must be defined in .env");
    }
    const PORT = process.env.PORT || 3000;

    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("Connected to MongoDb");

    app.listen(PORT || 3000, () => {
      console.log(`Listening on port ${PORT}!`);
    });
  } catch (err) {
    console.error(err);
  }
};

start();
