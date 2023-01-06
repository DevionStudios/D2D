import express, { Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest, BadRequestError } from "@devion/common";
import { currentUser } from "../../middlewares/currentuser";
import { User, UserDoc } from "../../models/User";
import { Post } from "../../models/Post";
import { Comment } from "../../models/Comment";
import mongoose from "mongoose";

const router = express.Router();

router.post(
  "/api/comments/create",
  currentUser,
  async (req: Request, res: Response) => {
    try {
      const { postId, caption } = req.body;

      const post = await Post.findOne({
        _id: new mongoose.Types.ObjectId(postId),
      });

      if (!post) {
        throw new BadRequestError("Post not found!");
      }

      const existingUser = await User.findOne({
        username: req.foxxiUser!.username,
      });

      if (!existingUser) {
        throw new BadRequestError("User not found!");
      }

      const comment = Comment.build({
        caption: caption,
        author: existingUser as UserDoc,
        postId: post.id,
      });

      if (!post.comments) {
        post.comments = [];
      }

      post?.comments!.push(comment);

      await comment.save();
      await post.save();

      res.status(201).send(post);
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
    }
  }
);

export { router as createCommentRouter };
