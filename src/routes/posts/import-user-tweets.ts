import { currentUser } from "../../middlewares/currentuser";
import express, { Request, Response } from "express";
import { BadRequestError } from "@devion/common";
import { TwitterApi } from "twitter-api-v2";
import dotenv from "dotenv";

import { Post, PostDoc } from "../../models/Post";
import { User, UserDoc } from "../../models/User";

const router = express.Router();
dotenv.config();

router.post("/api/tweets", currentUser, async (req: Request, res: Response) => {
  const { username } = req.body;
  const { currentUser } = req;
  if (!currentUser) {
    throw new BadRequestError("User not found!");
  }

  try {
    const existingUser = await User.findOne({
      username: currentUser.username,
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    const TwitterClient = new TwitterApi({
      appKey: "ZVQEkkCjxGn5QbynptoqwJNMP",
      appSecret: "HONytp7seX6w6cxzcn9Ij0QOHfciTWNFxiHDyU1h5WcqeDM12o",
      accessToken: "1499706059975720963-83VnJGjsYTEFiP1M8uVBRFl7fGjC7R",
      accessSecret: "r4c2nWnUYKHB7fTRunIAYYNuLe44tXv7ZWqconLxflw3P",
    });
    const appOnlyClientFromConsumer = await TwitterClient.appLogin();
    const usernameResponse = await appOnlyClientFromConsumer.v2.userByUsername(
      username
    );
    const apiResponse = await appOnlyClientFromConsumer.v2.userTimeline(
      usernameResponse.data.id,
      {
        max_results: 100,
        exclude: ["replies"],
        "tweet.fields": ["created_at"],
      }
    );

    const tweets = apiResponse.data.data;
    const posts: PostDoc[] = [];

    tweets?.map(async (tweet: any) => {
      const existingPost = await Post.findOne({
        twitterId: tweet.id,
      });
      if (!existingPost) {
        const post = Post.build({
          twitterId: tweet.id,
          caption: tweet.text,
          author: existingUser as UserDoc,
          createdAt: new Date(tweet.created_at),
        });
        posts.push(post);

        await post.save();
      } else {
        console.log(`Post with ${tweet.id} already exists`);
      }
    });

    // update existing user with new posts
    existingUser.posts = existingUser!.posts?.concat(posts);
    await existingUser.save();

    res.status(201).send({
      Posts: posts,
      ExistingUserPosts: existingUser!.posts,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err });
  }
});

export { router as importUserTweetsRouter };
