import { Community } from "../../models/Community";
import { CommunityChannel } from "../../models/CommunityChannel";
import { BadRequestError } from "@devion/common";
import express, { Request, Response } from "express";
import { User } from "../../models/User";
import { currentUser } from "../../middlewares/currentuser";

const router = express.Router();

router.post(
  "/api/community/channel/create",
  currentUser,
  async (req: any, res: Response) => {
    const {
      name,
      channelName,
      description = "",
      maxNumbers = 10,
      isPublic = false,
    } = req.body;
    try {
      console.log(req.body);
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
        (member) =>
          member.userId.toString() === req.foxxiUser!.id.toString() &&
          member.role === "admin"
      );
      if (!existingAdmin) {
        throw new BadRequestError(
          "You are not authorized to create a channel!"
        );
      }
      const existingChannel = community.channels?.find(
        (channel) => channel.name === channelName
      );
      if (existingChannel) {
        throw new BadRequestError("Channel already exists!");
      }
      const newChannel = CommunityChannel.build({
        name: channelName,
        maxNumbers,
        community,
        creator: existingUser,
        description,
        public: isPublic,
      });
      await newChannel.save();
      community.channels?.push(newChannel);
      await community.save();
      res.status(201).send(newChannel);
    } catch (e) {
      console.log(e);
      res.status(500).send({ message: e });
    }
  }
);

export { router as createCommunityChannelRouter };
