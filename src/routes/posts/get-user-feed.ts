import express, { Request, Response } from "express";

import { BadRequestError } from "@devion/common";
import { currentUser } from "../../middlewares/currentuser";
import { User } from "../../models/User";
import { Post, PostDoc } from "../../models/Post";

const router = express.Router();

router.get(
  "/api/posts/feed",
  currentUser,
  async (req: Request, res: Response) => {
    try {
      const existingUser = await User.findOne({
        username: req.currentUser!.username,
      }).populate({
        path: "following",
      });

      console.log("cu", req.currentUser);

      if (!existingUser) {
        throw new BadRequestError("User not found!");
      }

      const usersFollwed = existingUser.following || [];
      const hashtagsFollowed = existingUser.hashtagsfollowed || [];

      let userFeed: PostDoc[] = [];

      // get all the posts that have the hashtags that the user is following and add them to the userFeed
      for (let i = 0; i < hashtagsFollowed.length; i++) {
        const posts = await Post.find({ hashtags: hashtagsFollowed[i] });
        userFeed = userFeed.concat(posts);
      }

      // get all the posts by the users followed
      for (let i = 0; i < usersFollwed.length; i++) {
        const user = await User.findOne({ _id: usersFollwed[i] }).populate(
          "posts"
        );
        if (user) {
          userFeed = userFeed.concat(user.posts || []);
        }
      }

      res.status(200).send(userFeed);
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
    }
  }
);

export { router as getUserFeedRouter };
