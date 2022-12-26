import express, { Request, Response } from "express";

import { BadRequestError, currentUser } from "@devion/common";
import { User } from "../../models/User";

const router = express.Router();

router.put(
  "/api/users/update-profile",
  currentUser,
  async (req: Request, res: Response) => {
    try {
      const { username, name, bio, image } = req.body;

      const existingUser = await User.findOne({
        email: req.currentUser!.email,
      });

      if (!existingUser) {
        throw new BadRequestError("User not found");
      }

      // Update user details if they are different, otherwise fallback to existing values
      existingUser.username = username || existingUser.username;
      existingUser.name = name || existingUser.name;
      existingUser.bio = bio || existingUser.bio;
      existingUser.image = image || existingUser.image;

      await existingUser.save();

      res.status(200).send(existingUser);
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
    }
  }
);

export { router as updateProfileRouter };
