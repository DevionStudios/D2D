//joining and leaving community routes (admins can also use this same route)
import { Community, Role } from "./../../models/Community";
import { BadRequestError } from "@devion/common";
import express, { Request, Response } from "express";
import cloudinary from "../../config/cloudinaryConfig";
import upload from "../../config/multer.filefilter.config";
import path from "path";
import { User } from "../../models/User";
import { currentUser } from "../../middlewares/currentuser";

const router = express.Router();

router.put(
  "/api/community/join/:name",
  currentUser,
  async (req: any, res: Response) => {
    try {
      const existingUser = await User.findOne({ _id: req.foxxiUser!.id });
      if (!existingUser) {
        throw new BadRequestError("User not found!");
      }
      const { name } = req.params;
      const community = await Community.findOne({ name });
      if (!community) {
        throw new BadRequestError(
          "Community not found, invalid name provided!"
        );
      }
      //check if user is already not a member of the community
      const existingMember = community.members?.findIndex(
        (member) => member.userId.toString() === existingUser.id.toString()
      );
      if (existingMember !== -1) {
        throw new BadRequestError(
          "You are already a member of this community!"
        );
      }
      community.members?.push({
        userId: existingUser.id,
        role: Role.Member,
      });
      await community.save();
      existingUser.joinedCommunities?.push(community.id);
      await existingUser.save();
      res.status(200).send({
        message: "member joined community successfully",
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
    }
  }
);

export { router as joinCommunityRouter };
