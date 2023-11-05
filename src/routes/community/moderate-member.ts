//change role of any member of a community -- ban/unban, make/remove admin
//can also be used to remove a member from a community
import { Community } from "../../models/Community";
import { BadRequestError } from "@devion/common";
import express, { Request, Response } from "express";
import { User } from "../../models/User";
import { currentUser } from "../../middlewares/currentuser";
import { Role } from "../../models/Community";
const router = express.Router();

router.put(
  "/api/community/member/role/edit",
  currentUser,
  async (req: any, res: Response) => {
    try {
      const { userId, newRole, name } = req.body;
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
      const otherUser = await User.findOne({ _id: userId });
      if (!otherUser) {
        throw new BadRequestError("User not found!");
      }
      const memberIndex = community.members.findIndex(
        (member) => member.userId.toString() === otherUser.id.toString()
      );
      if (memberIndex === -1) {
        throw new BadRequestError("User is not part of community");
      }
      let memberObj = community.members![memberIndex];
      if (newRole === "admin") {
        // Update community details if they are different, otherwise fallback to existing values
        community.members![memberIndex] = {
          userId: otherUser.id,
          role: Role.Admin,
        };
      } else if (newRole === "member" || newRole === "unbanned") {
        community.members![memberIndex] = {
          userId: otherUser.id,
          role: Role.Member,
        };
      } else if (newRole === "banned") {
        community.members![memberIndex] = {
          userId: otherUser.id,
          role: Role.Banned,
        };
      } else if (newRole === "remove") {
        community.members?.splice(memberIndex, 1);
      } else {
        throw new BadRequestError("Invalid role");
      }
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
export { router as moderateCommunityMembersRouter };
