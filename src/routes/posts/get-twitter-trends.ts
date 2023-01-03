import { currentUser } from "../../middlewares/currentuser";
import express, { Request, Response } from "express";
import { BadRequestError } from "@devion/common";

import dotenv from "dotenv";

import { User } from "../../models/User";
import { TwitterApi } from "twitter-api-v2";

const router = express.Router();
dotenv.config();

router.get(
  "/api/tweets/trending",
  currentUser,
  async (req: Request, res: Response) => {
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
  }
);

export { router as getTrendingTweetsRouter };
