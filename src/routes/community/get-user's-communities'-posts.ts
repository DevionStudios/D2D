import { Community } from "./../../models/Community";
import { BadRequestError } from "@devion/common";
import { currentUser } from "../../middlewares/currentuser";
import express, { Request, Response } from "express";
import { Post } from "../../models/Post";
import { User } from "../../models/User";
const router = express.Router();

router.get(
  "/api/community/user/feed",
  currentUser,
  async (req: any, res: Response) => {
    try {
      const { limit = 20, skip = 0 } = req.query;
      const existingUser = await User.findOne({ _id: req.foxxiUser!.id });
      if (!existingUser) {
        throw new BadRequestError("User not found!");
      }
      //find all communities that the user is a member of
      const userCommunities = await Community.find({
        members: { $elemMatch: { userId: existingUser } },
      });
      const userCommunityFeed = await Post.find({
        communityId: { $in: userCommunities },
      })
        .populate("author")
        .skip(Number(skip))
        .limit(Number(limit))
        .sort({ createdAt: -1 });
      const { name } = req.params; //name of community
      const totalCommunityPosts = await Post.find({
        communityId: { $in: userCommunities },
      }).countDocuments();
      res.status(200).send({
        message: "Community posts",
        userCommunityFeed,
        totalCommunityPosts,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
    }
  }
);

export { router as getUserCommunityFeedRouter };
