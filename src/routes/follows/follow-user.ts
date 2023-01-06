import express, { Request, Response } from "express";

import { BadRequestError } from "@devion/common";
import { currentUser } from "../../middlewares/currentuser";
import { User } from "../../models/User";

const router = express.Router();

router.put(
  "/api/follow/users",
  currentUser,
  async (req: Request, res: Response) => {
    try {
      const { username, toFollow } = req.body;

      const existingUser = await User.findOne({ _id: req.foxxiUser!.id });
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
        _id: existingUserToFollow!.id,
        followers: {
          _id: existingUser!.id,
        },
      });

      if (existingFollow) {
        // Remove the user from the following array
        existingUser.following = existingUser.following?.filter(
          (user) => user._id.toString() !== existingUserToFollow._id.toString()
        );
        // for (let i = 0; i < existingUser.following!.length; i++) {
        //   if (
        //     existingUser.following![i].id.toString() ===
        //     existingUserToFollow.id.toString()
        //   ) {
        //     existingUser.following!.splice(i, 1);
        //   }
        // }
        // Remove the user from the followers array
        existingUserToFollow.followers = existingUserToFollow.followers?.filter(
          (user) => user._id.toString() !== existingUser._id.toString()
        );
        // for (let i = 0; i < existingUserToFollow.followers!.length; i++) {
        //   if (
        //     existingUserToFollow.followers![i].id.toString() ===
        //     existingUser.id.toString()
        //   ) {
        //     existingUserToFollow.followers!.splice(i, 1);
        //   }
        // }
        await existingUser.save();
        await existingUserToFollow.save();

        return res.status(200).send({ message: "User Unfollowed!" });
      } else {
        existingUser.following?.push(existingUserToFollow);
        existingUserToFollow.followers?.push(existingUser);

        await existingUser.save();
        await existingUserToFollow.save();

        res.status(201).send({ message: "User Followed!" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
    }
  }
);

export { router as followUserRouter };
