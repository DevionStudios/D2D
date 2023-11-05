import { Community } from "./../../models/Community";
import { BadRequestError } from "@devion/common";
import express, { Request, Response } from "express";
import { Post } from "../../models/Post";
const router = express.Router();

router.get("/api/community/posts/:name", async (req: any, res: Response) => {
  try {
    const { name } = req.params; //name of community
    const { limit = 20, skip = 0 } = req.query;
    const community = await Community.findOne({ name });
    if (!community) {
      throw new BadRequestError("Community not found, invalid name provided!");
    }
    const communityPosts = await Post.find({
      communityId: community,
    })
      .skip(Number(skip))
      .limit(Number(limit))
      .populate("author communityId")
      .sort({ createdAt: -1 });
    const totalCommunityPosts = await Post.find({
      communityId: community,
    }).countDocuments();
    res.status(200).send({
      message: "Community posts",
      communityPosts,
      totalCommunityPosts,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err });
  }
});

export { router as getCommunityPostsRouter };
