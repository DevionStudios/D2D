import { BadRequestError } from "@devion/common";
import express, { Request, Response } from "express";

import { Post } from "../../models/Post";
import { HashTag } from "../../models/HashTags";
import { User, UserDoc } from "../../models/User";
import cloudinary from "../../config/cloudinaryConfig";
import upload from "../../config/multer.filefilter.config";
import { currentUser } from "../../middlewares/currentuser";
import path from "path";
import { Community } from "../../models/Community";

const router = express.Router();

router.post(
  "/api/posts/create",
  currentUser,
  upload.single("media"),
  async (req: Request, res: Response) => {
    try {
      const { caption, gifLink, hashtags, communityId } = req.body;
      console.log(hashtags);
      let media;
      if (req.file) {
        const ext = path.extname(req.file!.originalname);
        let result,
          type = null;

        if (
          ext === ".jpg" ||
          ext === ".jpeg" ||
          ext === ".png" ||
          ext === ".gif"
        ) {
          type = "image";
          result = req.file
            ? await cloudinary.uploader.upload(req.file.path)
            : null;
        } else {
          type = "video";
          result = req.file
            ? await cloudinary.uploader.upload(req.file.path, {
                resource_type: "video",
                chunk_size: 6000000,
              })
            : null;
        }

        const mediaUrl = result?.secure_url || "";
        media = {
          url: mediaUrl,
          mediatype: type,
        };
      }

      const existingUser = await User.findOne({
        _id: req.foxxiUser!.id,
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
      if (communityId) {
        const existingCommunity = await Community.findOne({ _id: communityId });
        if (!existingCommunity) {
          throw new BadRequestError("Community not found!");
        }
        //check if user is a member of the community
        const isMember = existingCommunity.members?.some(
          (member) =>
            member.userId.toString() === existingUser.id.toString() &&
            member.role !== "banned"
        );
        if (!isMember) {
          throw new BadRequestError("You are not a member of this community!");
        }
        post.communityId = existingCommunity.id;
      }
      existingUser?.posts!.push(post);

      await post.save();
      await existingUser.save();

      // Save the hashtags in hashtag db
      if (hashtags) {
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
      }
      res.status(201).send({
        message: "Post created successfully",
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
    }
  }
);

export { router as createPostRouter };
