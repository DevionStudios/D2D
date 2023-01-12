import mongoose from "mongoose";
import { BadRequestError } from "@devion/common";
import express, { Request, Response } from "express";

import { Post } from "../../models/Post";
import { UserDoc } from "../../models/User";
import { currentUser } from "../../middlewares/currentuser";

const router = express.Router();

router.put(
  "/api/posts/edit/:id",
  currentUser,
  async (req: Request, res: Response) => {
    const { caption } = req.body;
    const { id } = req.params;
    const user = req.foxxiUser as UserDoc;
    console.log("Caption is:", caption);
    const post = await Post.findById(new mongoose.Types.ObjectId(id)).populate(
      "author"
    );

    if (!post) {
      throw new BadRequestError("Post not found");
    }

    if (post.author.id !== user.id) {
      return res.send({ message: "You are not authorized to edit this post" });
    }

    if (post.originalPostId) {
      throw new BadRequestError("You can't edit reposted posts");
    }

    post.caption = caption;
    await post.save();

    res.send(post);
  }
);

export { router as updatePostRouter };
