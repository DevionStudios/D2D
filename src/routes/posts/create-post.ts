import express, { Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest, BadRequestError } from "@devion/common";
import { currentUser } from "../../middlewares/currentuser";
import { User, UserDoc } from "../../models/User";
import { Post } from "../../models/Post";
import { HashTag } from "../../models/HashTags";
import cloudinary from "../../config/cloudinaryConfig";
import upload from "../../config/multer.filefilter.config";
import e from "express";

const router = express.Router();

router.post(
  "/api/posts/create",
  currentUser,
  upload.single("media"),
  async (req: Request, res: Response) => {
    try {
      const { caption, gifLink, hashtags } = req.body;
      console.log(hashtags);
      const result = req.file
        ? await cloudinary.uploader.upload(req.file.path)
        : null;
      const media = result?.secure_url || "";
      const existingUser = await User.findOne({
        _id: req.currentUser!.id,
      });

      if (!existingUser) {
        throw new BadRequestError("User not found!");
      }

      const post = Post.build({
        caption,
        media,
        gifLink,
        hashtags: hashtags || [],
        author: existingUser as UserDoc,
      });
      existingUser?.posts!.push(post);

      await post.save();
      await existingUser.save();

      // Save the hashtags in hashtag db
      if (typeof hashtags === "string") {
        const existingHashtag = await HashTag.findOne({
          content: hashtags,
        });
        if (existingHashtag) {
          existingHashtag.useCounter = existingHashtag.useCounter + 1;
          await existingHashtag.save();
        } else {
          const newHashtag = HashTag.build({
            content: hashtags,
            useCounter: 1,
          });
          await newHashtag.save();
        }
      } else {
        for (let i = 0; i < hashtags.length; i++) {
          console.log(hashtags[i]);
          const existingHashtag = await HashTag.findOne({
            content: hashtags[i],
          });
          if (existingHashtag) {
            existingHashtag.useCounter = existingHashtag.useCounter + 1;
            await existingHashtag.save();
          } else {
            const newHashtag = HashTag.build({
              content: hashtags[i],
              useCounter: 1,
            });
            await newHashtag.save();
          }
        }
      }

      res.status(201).send(post);
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
    }
  }
);

export { router as createPostRouter };
