import { currentUser } from "../../middlewares/currentuser";
import express, { Request, Response } from "express";
import axios from "axios";

import { Post } from "../../models/Post";
import { User } from "../../models/User";

const router = express.Router();

router.post("/api/tweets", currentUser, async (req: Request, res: Response) => {
  const { twitterId } = req.body;
  try {
    const existingUser = await User.findOne({
      username: req.currentUser!.username,
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    const tweets = await axios.get(
      `https://api.twitter.com/2/users/${twitterId}/tweets`
    );

    tweets.data.data.map(async (tweet: any) => {
      if (!tweet.in_reply_to_user_id) {
        const post = new Post({
          caption: tweet.text,
          author: existingUser,
          createdAt: tweet.created_at,
          media: tweet.attachments?.media_keys[0] || "",
        });

        await post.save();
      }
    });

    res.status(201).send({
      message: "Tweets imported successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err });
  }
});

export { router as importUserTweetsRouter };
