import { Community } from "./../../models/Community";
import { BadRequestError } from "@devion/common";
import express, { Request, Response } from "express";
import cloudinary from "../../config/cloudinaryConfig";
import upload from "../../config/multer.filefilter.config";
import path from "path";
import { User } from "../../models/User";
import { currentUser } from "../../middlewares/currentuser";

const router = express.Router();

router.put(
  "/api/community/create",
  currentUser,
  upload.fields([
    { name: "avatarImage", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  async (req: any, res: Response) => {
    try {
      const {
        publicName,
        description,
        rules = [],
        tags = [],
        isSafeForWork = true,
      } = req.body;
      let avatarImageUrl = "",
        bannerImageUrl = "";
      if (req.files) {
        const files = req.files;
        if (files.avatarImage && files.avatarImage.length > 0) {
          const imageFilePath = files.image[0].path;
          var result = await cloudinary.uploader.upload(imageFilePath);
          avatarImageUrl = result.secure_url;
        }
        if (files.bannerImage && files.bannerImage.length > 0) {
          const bannerImageFilePath = files.bannerImage[0].path;
          var result = await cloudinary.uploader.upload(bannerImageFilePath);
          bannerImageUrl = result.secure_url;
        }
      }
      const existingUser = await User.findOne({ _id: req.foxxiUser!.id });

      if (!existingUser) {
        throw new BadRequestError("User not found!");
      }
      if (!publicName) {
        throw new BadRequestError("Community name is required!");
      }

      const newCommunity = Community.build({
        publicName,
        creator: existingUser,
        description,
        rules,
        avatar: avatarImageUrl,
        banner: bannerImageUrl,
        members: [],
        tags,
        isSafeForWork,
      });

      await newCommunity.save();
      existingUser.joinedCommunities?.push(newCommunity.id);
      await existingUser.save();
      res.status(201).send({
        message: "Community created successfully",
        newCommunity,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
    }
  }
);

export { router as createCommunityRouter };
