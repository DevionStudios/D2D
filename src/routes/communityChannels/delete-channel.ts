import { Community } from "../../models/Community";
import { CommunityChannel } from "../../models/CommunityChannel";
import { BadRequestError } from "@devion/common";
import express, { Request, Response } from "express";
import { User } from "../../models/User";
import { currentUser } from "../../middlewares/currentuser";

const router = express.Router();

router.post(
  "/api/community/channel/delete",
  currentUser,
  async (req: any, res: Response) => {
    const { name, channel } = req.body;
    try {
      const existingUser = await User.findOne({ _id: req.foxxiUser!.id });
      if (!existingUser) {
        throw new BadRequestError("User not found!");
      }
      if (!name) {
        throw new BadRequestError("Community name is required!");
      }
      const community = await Community.findOne({ name });
      if (!community) {
        throw new BadRequestError("Community not found!");
      }
      //check if existingUser is an admin of the community
      const existingAdmin = community.members.find(
        (member) => member.userId === existingUser.id && member.role === "admin"
      );
      if (!existingAdmin) {
        throw new BadRequestError(
          "You are not authorized to create a channel!"
        );
      }
      const currentChannelIndex = community.channels!.findIndex(
        (chan) => chan.toString() === channel.toString()
      );
      if (currentChannelIndex < 0) {
        throw new BadRequestError("Channel does not exist!");
      }
      community.channels?.splice(currentChannelIndex, 1);
      await community.save();
      await CommunityChannel.deleteOne({ _id: channel });
      res.status(201).send("Channel deleted!");
    } catch (e) {
      console.log(e);
      res.status(500).send({ message: e });
    }
  }
);

export { router as deleteCommunityChannelRouter };
