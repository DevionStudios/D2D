import express from "express";
import "express-async-errors";
import { json, urlencoded } from "body-parser";
import cookieSession from "cookie-session";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
dotenv.config();

import { signupRouter } from "./routes/auth/signup";
import { signinRouter } from "./routes/auth/signin";
import { signoutRouter } from "./routes/auth/signout";
import { currentUserRouter } from "./routes/auth/current-user";
import { updateProfileRouter } from "./routes/auth/update-profile";
import { followUserRouter } from "./routes/follows/follow-user";
import { createPostRouter } from "./routes/posts/create-post";
import { getUserPostsRouter } from "./routes/posts/get-user-posts";
import { updatePostRouter } from "./routes/posts/update-post";
import { deletePostRouter } from "./routes/posts/delete-post";
import { getUserFeedRouter } from "./routes/posts/get-user-feed";
import { fetchUserRouter } from "./routes/auth/fetch-user";
import { updatePasswordRouter } from "./routes/auth/update-password";
import { getAllPostsRouter } from "./routes/posts/get-all-posts";
import { getPostRouter } from "./routes/posts/get-post-by-id";

const app = express();
// app.set("trust proxy", true);
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(
  urlencoded({
    extended: true,
  })
);

app.use(getUserFeedRouter);
app.use(updateProfileRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(currentUserRouter);
app.use(fetchUserRouter);
app.use(followUserRouter);
app.use(createPostRouter);
app.use(getPostRouter);
app.use(getUserPostsRouter);
app.use(updatePostRouter);
app.use(deletePostRouter);
app.use(updatePasswordRouter);
app.use(getAllPostsRouter);

app.all("*", async (req: any, res: any) => {
  throw new Error("Route not found!!");
});

export { app };
