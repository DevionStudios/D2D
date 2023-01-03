import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose, { mongo } from "mongoose";
import { Post, PostSchema } from "../../models/Post";
import { BadRequestError } from "@devion/common";
import { User, UserDoc } from "../../models/User";

const router = express.Router();

router.get("/api/posts/:username", async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const existingUser = await User.findOne({
      username: username,
    }).populate({
      path: "posts",
      populate: { path: "author" },
    });

    if (!existingUser) {
      throw new BadRequestError("User not found!");
    }

    res.status(200).send(existingUser.posts);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err });
  }
});

export { router as getUserPostsRouter };
