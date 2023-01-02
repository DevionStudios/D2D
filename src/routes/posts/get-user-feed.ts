import express, { Request, Response } from "express";

import { BadRequestError } from "@devion/common";
import { currentUser } from "../../middlewares/currentuser";
import { User } from "../../models/User";

const router = express.Router();

router.get(
  "/api/posts/feed",
  currentUser,
  async (req: Request, res: Response) => {
    try {
      const { currentUser } = req;
      if (!currentUser) {
        throw new BadRequestError("User not found!");
      }

      const existingUser = await User.findOne({
        username: currentUser!.username,
      })
        .populate({
          path: "following",
          populate: {
            path: "posts",
          },
        })
        .sort({ createdAt: -1 });

      if (!existingUser) {
        throw new BadRequestError("User not found!");
      }

      res.status(200).send(existingUser.following);
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
    }
  }
);

export { router as getUserFeedRouter };
