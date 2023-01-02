import express, { Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest, BadRequestError } from "@devion/common";
import { currentUser } from "../../middlewares/currentuser";
import { UserDoc } from "../../models/User";
import { Post } from "../../models/Post";
import mongoose from "mongoose";
const router = express.Router();

router.put(
  "/api/posts/edit/:id",
  currentUser,
  async (req: Request, res: Response) => {
    const { caption } = req.body;
    const { id } = req.params;
    const user = req.currentUser as UserDoc;
    console.log("Caption is:", caption);
    const post = await Post.findById(new mongoose.Types.ObjectId(id)).populate(
      "author"
    );

    if (!post) {
      throw new BadRequestError("Post not found");
    }

    if (post.author.id !== user.id) {
      throw new BadRequestError("You are not authorized to edit this post");
    }

    post.caption = caption;
    await post.save();

    res.send(post);
  }
);

export { router as updatePostRouter };
