import { BadRequestError } from "@devion/common";
import express, { Request, Response } from "express";

import { Story } from "../../models/Story";
import { User, UserDoc } from "../../models/User";
import cloudinary from "../../config/cloudinaryConfig";
import upload from "../../config/multer.filefilter.config";
import { currentUser } from "../../middlewares/currentuser";
import mongoose from "mongoose";

const router = express.Router();

router.get(
  "/api/story/getstories",
  currentUser,
  async (req: Request, res: Response) => {
    try {
      const existingUser = await User.findOne({
        _id: new mongoose.Types.ObjectId(req.foxxiUser!.id),
      }).populate({
        path: "following",
        populate: {
          path: "stories",
          model: "Story",
        },
      });

      if (!existingUser) {
        throw new BadRequestError("User not found!");
      }

      res.status(200).send({
        message: "Stories fetched successfully",
        stories: existingUser.following,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: error });
    }
  }
);

export { router as getFollowingUserStoriesRouter };
