import { BadRequestError } from "@devion/common";
import express, { Request, Response } from "express";

import { Post } from "../../models/Post";
import { currentUser } from "../../middlewares/currentuser";

const router = express.Router();

router.delete(
  "/api/posts/delete/:id",
  currentUser,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const existingPost = await Post.findOne({ _id: id }).populate("author");

      if (!existingPost) {
        throw new BadRequestError("Post not found!");
      }

      if (existingPost.author.id !== req.foxxiUser?.id) {
        throw new BadRequestError("You are not the author!");
      }

      await Post.deleteOne({ _id: id });

      res.status(204).send({ message: "Post deleted!" });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
    }
  }
);

export { router as deletePostRouter };
