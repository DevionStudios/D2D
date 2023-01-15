import { BadRequestError } from "@devion/common";
import express, { Request, Response } from "express";

import { Story } from "../../models/Story";
import { User, UserDoc } from "../../models/User";
import cloudinary from "../../config/cloudinaryConfig";
import upload from "../../config/multer.filefilter.config";
import { currentUser } from "../../middlewares/currentuser";
import mongoose from "mongoose";

const router = express.Router();

router.post(
  "/api/story/create",
  currentUser,
  upload.single("media"),
  async (req: Request, res: Response) => {
    try {
      const { caption } = req.body;
      const result = req.file
        ? await cloudinary.uploader.upload(req.file.path)
        : null;
      const media = result?.secure_url || "";

      const existingUser = await User.findOne({
        _id: new mongoose.Types.ObjectId(req.foxxiUser!.id),
      });

      if (!existingUser) {
        throw new BadRequestError("User not found!");
      }

      const story = Story.build({
        caption,
        media,
        author: existingUser as UserDoc,
      });
      existingUser?.stories!.push(story);

      await story.save();
      await existingUser.save();

      res.status(201).send({
        message: "Story created successfully",
      });
    } catch (err) {
      console.log(err);
      res.status(400).send({ message: err });
    }
  }
);

export { router as createStoryRouter };
