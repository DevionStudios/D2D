import { currentUser } from "../../middlewares/currentuser";
import express, { Request, Response } from "express";
import { BadRequestError } from "@devion/common";
import { TwitterApi } from "twitter-api-v2";
import dotenv from "dotenv";

import { Post } from "../../models/Post";
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
      appKey: process.env.TWITTER_API_KEY!,
      appSecret: process.env.TWITTER_API_SECRET!,
      accessToken: process.env.TWITTER_ACCESS_TOKEN!,
      accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
    });
    const appOnlyClientFromConsumer = await TwitterClient.appLogin();
    const usernameResponse = await appOnlyClientFromConsumer.v2.userByUsername(
      username
    );
    const apiResponse = await appOnlyClientFromConsumer.v2.userTimeline(
      usernameResponse.data.id,
      {
        max_results: 100,
        exclude: ["replies", "retweets"],
        "tweet.fields": ["created_at"],
      }
    );

    const tweets = apiResponse.data.data;

    tweets.map(async (tweet: any) => {
      const existingPost = await Post.findOne({
        twitterId: tweet.id,
      });
      const theUser = await User.findOne({
        username: currentUser.username,
      });
      if (!existingPost) {
        const post = Post.build({
          twitterId: tweet.id,
          caption: tweet.text,
          author: existingUser as UserDoc,
          createdAt: new Date(tweet.created_at),
        });

        theUser!.posts!.push(post);
        await post.save();
        await theUser!.save();
      } else {
        console.log(`Post with ${tweet.id} already exists`);
      }
    });

    res.status(201).send({
      ExistingUserPosts: existingUser!.posts,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err });
  }
});

export { router as importUserTweetsRouter };
