//joining and leaving community routes
import { Community, Role } from "./../../models/Community";
import { BadRequestError } from "@devion/common";
import express, { Request, Response } from "express";
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
      const memberDoc = community.members[existingMember].userId;
      if (community.creator?.toString() == memberDoc.toString())
        throw new BadRequestError(
          "You cannot leave the community as you are the creator"
        );
      community.members.splice(existingMember, 1);
      await community.save();
      //Removing community from user's joinedCommunities array
      existingUser.joinedCommunities = existingUser.joinedCommunities?.filter(
        (community1) => community1.toString() !== community.id.toString()
      );
      await existingUser.save();
      res.status(200).send({
        message: "member has left the community",
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
    }
  }
);

export { router as leaveCommunityRouter };
