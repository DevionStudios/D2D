//change publicName, rules, description, avatar or banner of a community

import { Community } from "./../../models/Community";
import { BadRequestError } from "@devion/common";
import express, { Request, Response } from "express";
import cloudinary from "../../config/cloudinaryConfig";
import upload from "../../config/multer.filefilter.config";
import path from "path";
import { User } from "../../models/User";
import { currentUser } from "../../middlewares/currentuser";
import { Role } from "../../models/Community";
const router = express.Router();

router.put(
  "/api/community/edit",
  currentUser,
  upload.fields([
    { name: "avatarImage", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  async (req: any, res: Response) => {
    try {
      const { publicName, description, rules = [], tags = [], name } = req.body;
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
      const community = await Community.findOne({ name });
      if (!community) {
        throw new BadRequestError(
          "Community not found, invalid name provided!"
        );
      }
      console.log(existingUser);
      //loop through members and check if userId matches with existing user and if role is admin
      const isAdmin = community.members?.some(
        (member) =>
          member.userId.toString() === existingUser.id.toString() &&
          member.role == Role.Admin
      );
      if (!isAdmin) {
        throw new BadRequestError(
          "You are not authorized to edit this community!"
        );
      }
      // Update community details if they are different, otherwise fallback to existing values
      if (publicName?.length > 0) {
        //if publicName is being changed, then also modify the name accordingly
        community.publicName = publicName;
      } else {
        throw new BadRequestError("Public Name Cannot Be Empty!");
      }
      community.description = description || community.description;
      community.avatar = avatarImageUrl || community.avatar;
      community.banner = bannerImageUrl || community.banner;
      community.rules = rules || community.rules;
      community.tags = tags || community.tags;
      await community.save();
      res.status(200).send({
        message: "Community edited successfully",
        community,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
    }
  }
);

export { router as editCommunityRouter };
