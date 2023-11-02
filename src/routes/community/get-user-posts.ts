import express, { Request, Response } from "express";
import { BadRequestError } from "@devion/common";

import { User } from "../../models/User";
import { Community } from "../../models/Community";
import { Post } from "../../models/Post";

const router = express.Router();

router.get(
  "/api/community/posts/:name/:username",
  async (req: Request, res: Response) => {
    try {
      const { limit = 20, skip = 0 } = req.query;
      const { username, name } = req.params; //name=name of community
      const community = await Community.findOne({ name });
      if (!community) {
        throw new BadRequestError(
          "Community not found, invalid name provided!"
        );
      }
      const existingUser = await User.findOne({
        username: username,
      });
      if (!existingUser) {
        throw new BadRequestError("User not found!");
      }
      const userCommPosts = await Post.find({
        communityId: community,
        author: existingUser,
      })
        .sort({ createdAt: -1 })
        .skip(Number(skip))
        .limit(Number(limit));
      const totalPosts = await Post.find({
        communityId: community,
        author: existingUser,
      }).countDocuments();
      res.status(200).send({
        userPosts: userCommPosts,
        message: "User's posts in the community",
        userCommPosts,
        totalPosts,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
    }
  }
);

export { router as getCommunityUserPostsRouter };
