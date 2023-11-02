import { Community } from "./../../models/Community";
import { BadRequestError } from "@devion/common";
import express, { Request, Response } from "express";
import { Post } from "../../models/Post";
const router = express.Router();

router.get("/api/community/posts/discover", async (req: any, res: Response) => {
  try {
    const { limit = 20, skip = 0 } = req.query;
    const communityPosts = await Post.find({
      communityId: { $exists: true },
    })
      .skip(Number(skip))
      .limit(Number(limit))
      .populate("author communityId")
      .sort({ createdAt: -1 });
    res.status(200).send({
      message: "Community posts discovery",
      communityPosts,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err });
  }
});

export { router as discoverCommunityPostsRouter };
