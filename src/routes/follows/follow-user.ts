import express, { Request, Response } from "express";

import { BadRequestError } from "@devion/common";
import { currentUser } from "../../middlewares/currentuser";
import { User } from "../../models/User";

const router = express.Router();

router.put("/api/follows", currentUser, async (req: Request, res: Response) => {
  try {
    const { userid, toFollow } = req.body;

    const existingUser = await User.findOne({ _id: req.currentUser!.id });
    const existingUserToFollow = await User.findOne({ _id: userid });

    if (!existingUser) {
      throw new BadRequestError("User not found!");
    }

    if (!existingUserToFollow) {
      throw new BadRequestError("User to follow not found!");
    }

    if (existingUser.id === existingUserToFollow.id) {
      throw new BadRequestError("You cannot follow yourself!");
    }

    const existingFollow = await User.findOne({
      _id: req.currentUser!.id,
      "following.id": userid,
    });

    if (existingFollow) {
      throw new BadRequestError("You are already following this user!");
    }

    existingUser.following?.push(existingUserToFollow);
    existingUserToFollow.followers?.push(existingUser);

    await existingUser.save();
    await existingUserToFollow.save();

    res.status(201).send({ message: "User Followed!" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err });
  }
});

export { router as followUserRouter };
