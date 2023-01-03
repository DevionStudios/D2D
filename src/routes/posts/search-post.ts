import express, { Request, Response } from "express";
import mongoose from "mongoose";

import { Post } from "../../models/Post";

const router = express.Router();

router.get(
  "/api/post/search/:searchWord",
  async (req: Request, res: Response) => {
    console.log("Search of post:", req.params.id);
    try {
      const post = await Post.find({
        hashtags: { $in: req.params.searchWord },
      }).sort({ createdAt: -1 });
      console.log(post);
      res.status(200).send(post);
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
    }
  }
);

export { router as searchPostRouter };
