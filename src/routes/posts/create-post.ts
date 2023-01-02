import express, { Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest, BadRequestError } from "@devion/common";
import { currentUser } from "../../middlewares/currentuser";
import { User, UserDoc } from "../../models/User";
import { Post } from "../../models/Post";
import cloudinary from "../../config/cloudinaryConfig";
import upload from "../../config/multer.filefilter.config";

const router = express.Router();

router.post(
  "/api/posts/create",
  currentUser,
  upload.single("media"),
  async (req: Request, res: Response) => {
    try {
      const { content, gifLink } = req.body;
      const result = req.file
        ? await cloudinary.uploader.upload(req.file.path)
        : null;
      const media = result.secure_url;
      const existingUser = await User.findOne({
        _id: req.currentUser!.id,
      });

      if (!existingUser) {
        throw new BadRequestError("User not found!");
      }

      const post = Post.build({
        content,
        media,
        gifLink,
        author: existingUser as UserDoc,
      });
      await post.save();

      res.status(201).send(post);
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
    }
  }
);

export { router as createPostRouter };
