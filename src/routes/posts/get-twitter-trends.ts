import { currentUser } from "../../middlewares/currentuser";
import express, { Request, Response } from "express";
import { BadRequestError } from "@devion/common";

import dotenv from "dotenv";

import { User } from "../../models/User";
import { TwitterApi } from "twitter-api-v2";

const router = express.Router();
dotenv.config();

router.get("/api/tweets/trending", async (req: Request, res: Response) => {
  try {
    const TwitterClient = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY!,
      appSecret: process.env.TWITTER_API_SECRET!,
      accessToken: process.env.TWITTER_ACCESS_TOKEN!,
      accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
    });

    const appOnlyClientFromConsumer = await TwitterClient.appLogin();
    const trendingApiResponse = await appOnlyClientFromConsumer.v2.search(
      "trending -is:retweet -is:reply -is:quote",
      {
        max_results: 90,
        "tweet.fields": ["created_at"],
      }
    );

    res.send(trendingApiResponse.data.data);
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err });
  }
});

export { router as getTrendingTweetsRouter };
