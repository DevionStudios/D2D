import { Community } from "./../../models/Community";
import { BadRequestError } from "@devion/common";
import express, { Request, Response } from "express";
import { Post } from "../../models/Post";
const router = express.Router();

router.get("/api/community/posts/:name", async (req: any, res: Response) => {
  try {
    const { name } = req.params; //name of community
    const community = await Community.findOne({ name });
    if (!community) {
      throw new BadRequestError("Community not found, invalid name provided!");
    }
    const communityPosts = await Post.find({
      communityId: community.id,
    })
      .populate("author")
      .sort({ createdAt: -1 });
    res.status(201).send({
      message: "Community posts",
      communityPosts,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err });
  }
});

export { router as getCommunityPostsRouter };
