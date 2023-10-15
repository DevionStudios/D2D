//joining and leaving community routes
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
  "/api/community/leave/:name",
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
      let existingMember = -1;
      existingMember = community.members.findIndex(
        (member) => member.userId.toString() === existingUser.id.toString()
      );
      if (existingMember == -1) {
        throw new BadRequestError("You are not a member of this community!");
      }
      community.members.splice(existingMember, 1);
      await community.save();
      res.status(201).send({
        message: "member has left the community",
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
    }
  }
);

export { router as leaveCommunityRouter };
