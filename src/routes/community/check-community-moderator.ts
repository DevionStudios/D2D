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
  "/api/community/moderator",
  currentUser,
  async (req: any, res: Response) => {
    try {
      const { name } = req.body;
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
          member.userId.toString() === req.foxxiUser.id.toString() &&
          member.role == Role.Admin
      );
      res.status(200).send({
        isAdmin,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
    }
  }
);
export { router as checkCommunityModeratorRouter };
