import express, { Request, Response } from "express";
import { body } from "express-validator";

import { BadRequestError, currentUser } from "@devion/common";
import { User, UserDoc } from "../../models/User";

const router = express.Router();

router.get("/api/posts/:userid", async (req: Request, res: Response) => {
  try {
    const { userid } = req.params;

    const existingUser = await User.findOne({
      _id: userid,
    }).populate("posts");

    if (!existingUser) {
      throw new BadRequestError("User not found!");
    }

    res.status(200).send(existingUser.posts);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err });
  }
});

export { router as getUserPostsRouter };
