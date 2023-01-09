import { BadRequestError } from "@devion/common";
import express, { Request, Response } from "express";

import { Post } from "../../models/Post";
import { currentAdmin } from "../../middlewares/currentadmin";

const router = express.Router();

router.delete(
  "/api/admin/posts/delete/:id",
  currentAdmin,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const existingPost = await Post.findOne({ _id: id }).populate("author");

      if (!existingPost) {
        throw new BadRequestError("Post not found!");
      }

      await Post.deleteOne({ _id: id });

      res.status(204).send({ message: "Post deleted!" });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
    }
  }
);

export { router as deletePostAdminRouter };
