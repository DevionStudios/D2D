import express, { Request, Response } from "express";

import { BadRequestError, validateRequest } from "@devion/common";
import { currentUser } from "../../middlewares/currentuser";
import { User, UserDoc } from "../../models/User";
import { Post } from "../../models/Post";
import mongoose from "mongoose";
import { body } from "express-validator";

const router = express.Router();

router.put(
  "/api/like",
  // [
  //   body("id")
  //     .not()
  //     .isEmpty()
  //     .matches(/^[0-9a-fA-F]{24}$/)
  //     .withMessage("Post Id is not valid"),
  // ],
  // validateRequest,
  currentUser,
  async (req: Request, res: Response) => {
    const { id } = req.body;
    const post = await Post.findOne({
      _id: new mongoose.Types.ObjectId(id),
    }).populate("author");

    if (!post) {
      throw new BadRequestError("Post not found");
    }

    const existingUser = await User.findOne({ _id: req.currentUser!.id });

    if (!existingUser) {
      throw new BadRequestError("User not found!");
    }

    if (post.author.id === existingUser.id) {
      throw new BadRequestError("You cannot like your own post");
    }

    console.log("post: ", post);

    if (!post.likes) {
      post.likes = [];
      post.likes.push(existingUser);
    } else {
      const index = post.likes.findIndex((user) => user.id === existingUser.id);
      if (index === -1) {
        post.likes.push(existingUser);
      } else {
        post.likes.splice(index, 1);
      }
    }

    await post.save();

    res.send(post);
  }
);

export { router as LikePostRouter };
