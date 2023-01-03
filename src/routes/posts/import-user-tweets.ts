import { currentUser } from "../../middlewares/currentuser";
import express, { Request, Response } from "express";
import axios from "axios";
import { BadRequestError } from "@devion/common";
import { TwitterApi } from "twitter-api-v2";

import { Post } from "../../models/Post";
import { User } from "../../models/User";
import dotenv from "dotenv";
import mongoose from "mongoose";

const router = express.Router();
dotenv.config();

router.post("/api/tweets", currentUser, async (req: Request, res: Response) => {
  const { username } = req.body;
  const { currentUser } = req;
  if (!currentUser) {
    throw new BadRequestError("User not found!");
  }

  const BEARER_TOKEN =
    "AAAAAAAAAAAAAAAAAAAAAC6lcQEAAAAAJA3RDm04rVwek4E0hHnPU47lEys%3DRiw4aW4hsmRZmfyDjIArPk4zSFlvAxLNMT1IWDRZeDueGTMS9X";

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

    tweets.forEach(async (tweet: any) => {
      const existingPost = await Post.findOne({
        twitterId: tweet.id,
      });
      if (!existingPost) {
        const post = new Post({
          twitterId: tweet.id,
          caption: tweet.text,
          author: existingUser,
          createdAt: tweet.created_at,
        });
        existingUser?.posts!.push(post);

        await post.save();
        await existingUser.save();
      } else {
        console.log(`Post with ${tweet.id} already exists`);
      }
    });

    res.status(201).send({
      message: `Imported tweets from ${username}`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err });
  }
});

export { router as importUserTweetsRouter };
