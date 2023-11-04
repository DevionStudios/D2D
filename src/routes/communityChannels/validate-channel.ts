import { Community } from "../../models/Community";
import { CommunityChannel } from "../../models/CommunityChannel";
import { BadRequestError } from "@devion/common";
import express, { Request, Response } from "express";
import { User } from "../../models/User";
import { currentUser } from "../../middlewares/currentuser";

const router = express.Router();

router.post(
  "/api/community/channel/validate",
  currentUser,
  async (req: any, res: Response) => {
    const { name, channel } = req.body;
    try {
      if (!name) {
        throw new BadRequestError("Community name is required!");
      }
      const community = await Community.findOne({ name });
      if (!community) {
        throw new BadRequestError("Community not found!");
      }
      const channelDoc = await CommunityChannel.findOne({
        name: channel,
        community,
      });
      if (!channelDoc)
        throw new BadRequestError("Channel does not exist in this community!");
      res.status(201).send("Channel exists!");
    } catch (e) {
      console.log(e);
      res.status(500).send({ message: e });
    }
  }
);

export { router as validateCommunityChannelRouter };
