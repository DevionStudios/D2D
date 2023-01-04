import express, { Request, Response } from "express";

import { BadRequestError } from "@devion/common";
import { currentUser } from "../../middlewares/currentuser";
import { User } from "../../models/User";

const router = express.Router();

router.put("/api/follows", currentUser, async (req: Request, res: Response) => {
  try {
    const { username, toFollow } = req.body;

    const existingUser = await User.findOne({ _id: req.currentUser!.id });
    const existingUserToFollow = await User.findOne({ username: username });

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
      "following.id": existingUser?.id!,
    });

    if (existingFollow) {
      // Remove the user from the following array
      existingUser.following = existingUser.following?.filter(
        (user) => user.id !== existingUserToFollow.id
      );

      // Remove the user from the followers array
      existingUserToFollow.followers = existingUserToFollow.followers?.filter(
        (user) => user.id !== existingUser.id
      );

      await existingUser.save();
      await existingUserToFollow.save();

      return res.status(200).send({ message: "User Unfollowed!" });
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
