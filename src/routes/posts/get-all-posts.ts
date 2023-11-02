import express, { Request, Response } from "express";

import { Post } from "../../models/Post";

const router = express.Router();

router.get("/api/posts", async (req: Request, res: Response) => {
  try {
    const { limit = 20, skip = 0 } = req.query;
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip))
      .populate({
        path: "author",
      });
    res.status(200).send(posts);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err });
  }
});

export { router as getAllPostsRouter };
