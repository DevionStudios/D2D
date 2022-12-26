import express, { Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest, BadRequestError, currentUser } from "@devion/common";
import { UserDoc } from "../../models/User";
import { Post } from "../../models/Post";

const router = express.Router();

router.put(
  "/api/posts/:id",
  currentUser,
  [
    body("content")
      .trim()
      .isLength({ min: 1, max: 280 })
      .withMessage("Content must be between 1 and 280 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { content } = req.body;
    const { id } = req.params;
    const user = req.currentUser as UserDoc;

    const post = await Post.findById(id).populate("author");

    if (!post) {
      throw new BadRequestError("Post not found");
    }

    if (post.author.id !== user.id) {
      throw new BadRequestError("You are not authorized to edit this post");
    }

    post.content = content;
    await post.save();

    res.send(post);
  }
);

export { router as updatePostRouter };
